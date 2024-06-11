import { Injector, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_LINKS } from './tokens';
import { Link } from '../link';

/**
 * @internal
 */
type InjectorFnOr<T> = T | ((injector: Injector) => T);

/**
 * Provides app links token using angular provide- syntax instead of ngModule providers
 */
export function provideAppLinks(links: InjectorFnOr<Observable<Link[]>>) {
  return {
    provide: APP_LINKS,
    useFactory: (injector: Injector) => {
      return typeof links === 'function' && links !== null
        ? links(injector)
        : links ?? of([]);
    },
    deps: [Injector],
  } as Provider;
}
