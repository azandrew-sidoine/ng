import { Injector, LOCALE_ID, inject } from '@angular/core';
import { provideHeaderActions } from './views/directives/header';
import { DIALOG, provideDialog } from './views/directives/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
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
import { provideCommonStrings, providePipes } from '@azlabsjs/ngx-common';
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
// TODO: Uncomment the code below to import query library HTTP client provider
// import { provideQueryClient } from './views/helpers';

/** @internal */
type AuthHandlerType = { signOut: (revoke: boolean) => any };

/** Exported list of application level providers */
export const PROVIDERS = [
  {
    provide: LOCALE_ID,
    useFactory: () => {
      const { defaultView } = inject(DOCUMENT) ?? {};
      return defaultView ? defaultView.navigator.language : 'fr-FR';
    },
  },

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
  // providePipes({
  //   pipes: {},
  // }),

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
  provideCommonStrings({}),

  // TODO: Uncomment the code below to override default input validation message
  // provideTranslations({
  //   loadingText: 'Chargement en cours...',
  //   validation: {
  //     minlength:
  //       'La longueur minimal du champ est de {{requiredLength}}',
  //     maxlength:
  //       'La longueur maximale du champ est de {{requiredLength}}',
  //     maxLength: 'La longueur maximale du champ est de {{value}}',
  //     minLength: 'La longueur minimal du champ est de {{value}}',
  //     invalid: 'La valeur du champ est invalide',
  //     required: 'Le champ est requis',
  //     unique: 'La valeur de ce champ est déja existante',
  //     email: 'La valeur de ce champ doit être un adresse mail valid [example@email.com]',
  //     pattern: 'La valeur du champ est invalide',
  //     min: 'La valeur minimal du champ est de {{value}}',
  //     max: 'La valeur maximal du champ est de {{value}}',
  //     phone: 'Veuillez saisir un numéro de téléphone valid',
  //     minDate: 'Veuillez saisir une date ultérieure à la date du {{date}}',
  //     maxDate: 'Veuillez saisir une date antérieure à la date du {{date}}',
  //     exists: 'La valeur du champ n\'existe pas dans la dans la base de données',
  //     equals: 'La valeur du champ {{value}} ne correspond pas à la valeur saisie',
  //   },
  // })
];
