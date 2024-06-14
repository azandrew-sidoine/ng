import {
  Injector,
  LOCALE_ID,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { provideHeaderActions } from './views/directives/header';
import { DIALOG, provideDialog } from './views/directives/dialog';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  filter,
  finalize,
  first,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  providePreferredCountries,
  provideSupportedCountries,
} from '@azlabsjs/ngx-intl-tel-input';
import { provideDatagridConfig } from './views/directives/datagrid';
import {
  provideRouterChanges,
  provideRouterNavigate,
} from './views/directives/router';
import { provideAppLinks } from './views/directives/main-nav';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment';
import {
  ViewLayout,
  provideAppMetadata,
  provideViewLayout,
} from './views/directives/view';
import { LINKS } from './routes';
import { provideUploadOptions } from '@azlabsjs/ngx-file-input';
import {
  provideTranslations,
  useOptionsInterceptor,
} from '@azlabsjs/ngx-clr-form-control';
import {
  COMMON_STRINGS,
  CommonTextPipe,
  provideCommonStrings,
  providePipes,
} from '@azlabsjs/ngx-common';
import {
  provideFormsInitialization,
  provideFormsLoader,
  provideHttpClient,
  useBearerTokenInterceptor,
} from '@azlabsjs/ngx-smart-form';
import {
  provideCacheConfig,
  provideQueryClient,
} from '@azlabsjs/ngx-options-input';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslationChangeEvent,
} from '@ngx-translate/core';
import {
  HttpClient,
  provideHttpClient as ngProvideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JSObject } from '@azlabsjs/js-object';
import { useTranslationsFactory } from './translations';
import {
  AUTH_SERVICE,
  AuthStrategies,
  LoginModule,
  authClientInterceporFactory,
  bearerTokenInterceptorFactory,
  provideRedirectUrl,
  useLocalStrategy,
} from './views/login';
import { DOCUMENT_SESSION_STORAGE, StorageModule } from '@azlabsjs/ngx-storage';
import { UI_STATE_CONTROLLER } from './views/directives/ui-events';
import { provideAuthMetadata } from './views/login/ui';
// TODO: Uncomment the code below to import query library HTTP client provider
// import { provideQueryClient } from './views/helpers';

/** @internal */
type AuthHandlerType = { signOut: (revoke: boolean) => any };

export function createTranslateLoader() {
  return new TranslateHttpLoader(inject(HttpClient), './assets/i18n/', '.json');
}

/** Exported list of application level providers */
export const PROVIDERS = [
  {
    provide: LOCALE_ID,
    useFactory: () => {
      const { defaultView } = inject(DOCUMENT) ?? {};
      return defaultView ? defaultView.navigator.language : 'fr-FR';
    },
  },

  // Register translation library providers
  importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
      },
    })
  ),

  // Provides tokens from Ng HTTP library
  ngProvideHttpClient(
    withInterceptors([
      authClientInterceporFactory(
        JSObject.getProperty(environment, 'auth.local.clients.id'),
        JSObject.getProperty(environment, 'auth.local.clients.secret')
      ),
      bearerTokenInterceptorFactory(AUTH_SERVICE),
    ]),
    withFetch()
  ),

  /** provides injection tokens for navigation handler */
  provideRouterNavigate(),

  // /** Provides injection token for angular router change event */
  provideRouterChanges(),

  // /** Provides intl-tel-input preferred country */
  providePreferredCountries(['tg']),

  // // TODO: update the source code to provide application routing configration
  provideAppLinks({
    links: LINKS,
    authFactory: null,
    translationFactory: null,
  }),

  // /** TODO: update the list to change the list of supported countries */
  provideSupportedCountries(['tg', 'bj', 'gh', 'ci']),
  provideDatagridConfig({
    pagination: { page: 'page', perPage: 'per_page' },
    pageSize: 15,
    pageSizeOptions: [15, 20, 50, 100, 150],
    sort: {
      asQuery: false,
      by: 'by',
      order: 'order',
      ascending: 'asc',
      descending: 'desc',
    },
  }),

  // Provide dropdown with UI actions at the right side of the application header component
  provideHeaderActions({
    actions: [],
    signedInFactory: (i: Injector) => {
      return {
        invoke: () => {
          const auth = i.get(AUTH_SERVICE);
          return (
            typeof auth.authToken !== 'undefined' && auth.authToken !== null
          );
        },
      };
    },
    translator: (i: Injector | null) => (p: string | string[]) => {
      const LOGOUT_MESSAGE =
        'Vous êtes sur le point de vous déconnecter, veuillez confirmer pour poursuivre...';
      p = Array.isArray(p) ? p : [p];
      const translations = i?.get(COMMON_STRINGS);
      if (!translations) {
        return of({
          'prompt.logout': LOGOUT_MESSAGE,
          'actions.logout': 'Se Déconnecter',
        });
      }
      return translations.pipe(
        map((state) => {
          const result: Record<string, any> = {};
          for (const k of p) {
            JSObject.setProperty(result, k, JSObject.getProperty(state, k));
          }
          return JSObject.flatten(result) as any;
        })
      );
    },
    logout: (i: Injector | null) => {
      return {
        invoke: async (prompt: string) => {
          let result = true;
          if (prompt) {
            result = (await i?.get(DIALOG).confirm(prompt)) ?? result;
          }
          // Case user did not confirm the delete action we drop from the execution context
          if (!result) {
            return;
          }

          let auth: AuthHandlerType | null | undefined = i?.get(AUTH_SERVICE);
          // Logout application user
          if (auth) {
            await lastValueFrom(auth.signOut(true));
            i?.get(Router)?.navigateByUrl('/');
          } else {
            // Log error to the console for no provided handler
            console.error('No auth service provided handler provided.');
          }
        },
      };
    },
  }),

  // TODO: Uncomment the code below to provide query library HTTP client
  // provideQueryClient(),

  // Provides the view layout used globaly by the ngx-view component
  provideViewLayout(environment.ui.layout as ViewLayout),

  // Provides application metadata
  provideAppMetadata(environment),

  // // TODO: Update source code to use a custom dialog box
  provideDialog(),

  // TODO: Uncomment the code below to add custom pipes used in transform pipe
  providePipes({
    pipes: {
      text: CommonTextPipe,
    },
  }),

  // Forms API providers
  provideFormsLoader(),
  provideQueryClient({
    interceptorFactory: useOptionsInterceptor((request) =>
      request.clone({
        setHeaders: {
          // TODO: Add required headers
        },
      })
    ),
  }),
  provideCacheConfig(),
  // TODO: Uncomment the code below to register upload options service
  // provideUploadOptions(environment.upload.url, {
  //   interceptorFactory: (injector: Injector) => {
  //     return (request, next) => {
  //       request = request.clone({
  //         setHeaders: {
  //           // TODO: Add the list of headers to append to the request
  //         }
  //       });
  //       return next(request);
  //     };
  //   },
  // }),

  // TODO: Uncomment the code below to enable form initialization providers
  // provideFormsInitialization(environment.form.assets),
  provideHttpClient(
    'http://localhost:4000',
    useBearerTokenInterceptor()
    // await firstValueFrom(
    //   injector
    //     .get(AUTH_SERVICE)
    //     .signInState$.pipe(map((state) => state?.authToken ?? ''))
    // )
  ),

  // TODO: Add ngx-common module application texts loader
  provideCommonStrings(
    useTranslationsFactory((values) => {
      return { ...(values['app'] ?? {}), ...(values['auth'] ?? {}) };
    })
  ),

  // TODO: Uncomment the code below to override default input validation message
  provideTranslations(
    useTranslationsFactory((values) => {
      return {
        validation: JSObject.getProperty(values, 'app.validation'),
        loadingText: JSObject.getProperty(values, 'app.events.loading'),
      };
    })
  ),

  // Storage
  importProvidersFrom(
    StorageModule.forRoot({
      prefix: environment.storage.prefix,
      secret: environment.storage.secret,
    })
  ),

  // Login
  importProvidersFrom(
    LoginModule.forRoot({
      handleActions: (injector: Injector) => {
        return {
          success: async () => {
            const SIGNED_IN_TEXT =
              'Vous êtes connecté avec succès. Redirection...';
            const message = await firstValueFrom(
              injector
                .get(COMMON_STRINGS)
                .pipe(
                  map(
                    (state) =>
                      JSObject.getProperty(
                        state,
                        'auth.login.successful'
                      ) as string
                  )
                )
            );
            injector
              .get(UI_STATE_CONTROLLER)
              .endAction(message ?? SIGNED_IN_TEXT, 'success');
          },
          failure: async () => {
            const FAILED_SIGNED_IN_TEXT =
              "L'authentification a échoué, veuillez vérifier vos crédentiels et réessayer.";
            const message = await firstValueFrom(
              injector
                .get(COMMON_STRINGS)
                .pipe(
                  map(
                    (state) =>
                      JSObject.getProperty(state, 'auth.login.failed') as string
                  )
                )
            );
            injector
              .get(UI_STATE_CONTROLLER)
              .endAction(message ?? FAILED_SIGNED_IN_TEXT, 'bad-request');
          },
          error: async (err: unknown) => {
            injector
              .get(UI_STATE_CONTROLLER)
              .endAction('Request Error!', 'request-error');
          },
          // performingAction: () => {},
          logout: (injector: Injector) => {
            // TODO: Provide implementation that is called on logout
          },
        };
      },
      authConfigProvider: (injector: Injector) => {
        return {
          strategies: [
            {
              id: AuthStrategies.LOCAL,
              strategy: useLocalStrategy({
                client: injector.get(HttpClient),
                host: environment.auth.local.host,
                storage: injector.get(DOCUMENT_SESSION_STORAGE),
                endpoints: {
                  users: 'api/v2/user',
                  signIn: 'api/v2/login',
                  signOut: 'api/v2/logout',
                },
                // TODO: Provide an authentication driver if required
                // driver: 'legacy',
                // TODO: Provide auth result callback if required
                // authResultCallback: (
                //   result: Partial<SignInResultInterface>
                // ) => {
                //   // TODO: Provide a sign in state interceptor implementation
                //   // The interceptor must return true for the sign in to continue
                //   return true;
                // },
              }),
            },
          ],
          autoLogin: true,
        };
      },
    })
  ),
  provideAuthMetadata({
    dashboard: (injector: Injector) => {
      // Passed in as second parameter
      // _: SignInResultInterface
      // TODO: update the code is dashboard might change based on user's privileges
      return injector.get(Router).navigateByUrl('/dashboard/home');
    },
    name: environment.name,
    company: 'CNSS - TOGO',
    remember: false,
    logo: 'assets/media/logo.png',
    description: '',
  }),
  provideRedirectUrl(environment.auth.redirect.url ?? '/auth/login'),
];
