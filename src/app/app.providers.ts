import { Injector, LOCALE_ID, inject } from '@angular/core';
import { provideHeaderActions } from './views/directives/header';
import { DIALOG, provideDialog } from './views/directives/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
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
  // provideViewConfigsForLink(LINKS),

  /** provides injection tokens for navigation handler */
  provideRouterNavigate(),

  /** Provides injection token for angular router change event */
  provideRouterChanges(),

  /** Provides intl-tel-input preferred country */
  providePreferredCountries(['tg']),

  // TODO: update the source code to provide application routing configration
  provideAppLinks({
    links: [],
    authFactory: null,
    translationFactory: null,
  }),

  /** TODO: update the list to change the list of supported countries */
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

  // TODO: Update source code to use a custom dialog box
  provideDialog(),
];
