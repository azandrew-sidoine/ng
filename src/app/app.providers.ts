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
  CommonTextPipe,
  provideTranslations as provideCommonTranslations,
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
} from '@ngx-translate/core';
import {
  HttpClient,
  provideHttpClient as ngProvideHttpClient,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JSObject } from '@azlabsjs/js-object';
import { useTranslationsFactory } from './translations';
import { TranslationsType } from '@azlabsjs/ngx-common/lib/pipes/strings/types';
// TODO: Uncomment the code below to import query library HTTP client provider
// import { provideQueryClient } from './views/helpers';

/** @internal */
type AuthHandlerType = { signOut: (revoke: boolean) => any };

export function createTranslateLoader() {
  return new TranslateHttpLoader(inject(HttpClient), './assets/i18n/', '.json');
}

export const createTranslate = useTranslationsFactory();
export const createAppTranslator = createTranslate((values) => {
  return { ...(values['app'] ?? {}), auth: values['auth'] ?? {} };
});

// uncomment code below to allow filtering based on authenticated user scopes
// export function createHasScopes(
//   canAny?: (v: { scopes: string[] }, ...s: string[]) => boolean
// ) {
//   return (i: Injector) => {
//     const auth: any = i.get(AUTH_SERVICE);

//     if (!auth) {
//       return (() => true) as (scopes: string[]) => boolean;
//     }
//     return auth.signInState$.pipe(
//       map((state: any) => state?.scopes),
//       map((scopes: string[]) => (s: string[]) => {
//         s = s ?? [];
//         const fn = canAny ?? (() => true);
//         return s.length === 0 ? true : fn({ scopes: scopes ?? [] }, ...s);
//       })
//     );
//   };
// }

/** Exported list of application level providers */
export const PROVIDERS = [
  {
    provide: LOCALE_ID,
    useFactory: () => {
      const { defaultView } = inject(DOCUMENT) ?? {};
      return defaultView ? defaultView.navigator.language : 'fr-FR';
    },
  },

  // register translation library providers
  importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
      },
    })
  ),

  // provides tokens from Ng HTTP library
  ngProvideHttpClient(),

  /** provides injection tokens for navigation handler */
  provideRouterNavigate(),

  // /** provides injection token for angular router change event */
  provideRouterChanges(),

  // /** provides intl-tel-input preferred country */
  providePreferredCountries(environment.ui.telphone.countries.supported),

  // // TODO: update the source code to provide application routing configration
  provideAppLinks({
    links: LINKS,
    // hasScopes: createHasScopes(),
    translations: (i) => {
      const translations$ = createAppTranslator(i);
      return (p: string | string[]) => {
        let items = Array.isArray(p) ? p : [p];
        return translations$.pipe(
          map((values) =>
            items.reduce((y, x) => {
              y[x] = JSObject.getProperty(values, x);
              return y;
            }, {} as { [k: string]: any })
          )
        );
      };
    },
  }),

  // /** TODO: update the list to change the list of supported countries */
  provideSupportedCountries(environment.ui.telphone.countries.supported),
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
  provideHeaderActions({
    actions: [],
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

          // TODO: Provide integration of Auth service module
          let auth!: AuthHandlerType | null; // i.get(AUTH_SERVICE)
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
  provideCommonTranslations(createAppTranslator),

  // TODO: Uncomment the code below to override default input validation message
  provideTranslations(
    createTranslate((values) => {
      return {
        validation: JSObject.getProperty(values, 'app.validation') as any,
        loadingText: JSObject.getProperty(values, 'app.events.loading'),
      };
      // type cast to any to avoid typescript errors
    }) as any
  ),
];
