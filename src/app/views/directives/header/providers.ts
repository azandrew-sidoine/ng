import { Injector, Provider, inject } from '@angular/core';
import { Observable, from, isObservable, map, of, withLatestFrom } from 'rxjs';
import { HeaderAction } from './actions/types';
import { HEADER_ACTIONS_FACTORY } from './actions/tokens';

/** @internal */
type ObservableOr<T> = T | Observable<T>;

/** @internal */
type LogoutActionFactory = (i: Injector | null) => {
  invoke: (prompt: string) => Promise<void> | void;
} | null;

/** @internal */
type TranslationsType = {
  'app.prompt.logout': string;
  'app.actions.logout': string;
} & {
  [prop: string]: any;
};

/** @internal */
type TranslatorFactory = (
  o: Injector | null
) => (p: string | string[]) => ObservableOr<TranslationsType>;

/** @internal */
const LOGOUT_PROMPT =
  'You are about to logout from the application, please confirm to continue...';

/** @internal */
const ERR_NO_INJECTOR = 'No injector found in the logout handler context';

/**
 * Provides a global list of header actions for an application. These actions
 * are added to the top right of the topbar / application header component.
 *
 * ```
 * {
 *      providers: [
 *        // List of providers
 *        provideHeaderActions({
 *          actions: [{
 *              label: 'MyAction',
 *              fn: '/dashboard/users'
 *           }]
 *        })
 *      ]
 * ```
 *
 */
export function provideHeaderActions(p: {
  actions?: HeaderAction[];
  logout?: LogoutActionFactory;
  translator?: TranslatorFactory;
  signedIn?: (i: Injector) => { invoke: () => Observable<boolean> };
}) {
  return {
    provide: HEADER_ACTIONS_FACTORY,
    useFactory: () => {
      const { actions, logout, translator: translations, signedIn } = p;
      const _actions = actions ?? [];
      const injector = inject(Injector);
      const s = signedIn
        ? signedIn(injector)?.invoke() ?? of(false)
        : of(false);
      const items = ['app.actions.logout', 'app.prompt.logout'].concat(
        ..._actions.map((a) => a.label)
      );
      const t = translations
        ? translations(injector)(items)
        : of({} as TranslationsType);
      const observable$ = isObservable(t) ? from(t) : of(t);
      return observable$.pipe(
        withLatestFrom(s),
        map(([values, signedIn]) => {
          const a = [] as HeaderAction[];

          // Add list of user actions
          for (const action of _actions) {
            a.push({
              ...action,
              label: values[action.label] ?? action.label,
            });
          }

          // Add a logout action if required
          if (signedIn && logout) {
            a.push({
              label: values['app.actions.logout'] ?? 'Logout',
              fn: (i: Injector | null) => {
                if (i) {
                  return logout(i)?.invoke(
                    values['app.prompt.logout'] ?? LOGOUT_PROMPT
                  );
                }
                throw new Error(ERR_NO_INJECTOR);
              },
            });
          }

          // Returns the constructed list of actions
          return a;
        })
      );
    },
    deps: [],
  } as Provider;
}
