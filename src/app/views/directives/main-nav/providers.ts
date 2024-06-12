import { Injector, Provider, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_LINKS } from './tokens';
import { AppLinks, AuthFactory, TranslationFactory } from './types';
import { appLinks } from './helpers';

/** @description Provides app links token using angular provide- syntax instead of ngModule providers */
export function provideAppLinks(p: {
  links: AppLinks;
  authFactory?: AuthFactory | null;
  translationFactory?: TranslationFactory | null;
  canAny?: (v: { scopes: string[] }, ...s: string[]) => boolean;
}) {
  return {
    provide: APP_LINKS,
    useFactory: () => {
      const { links, translationFactory, authFactory, canAny } = p;
      return appLinks({
        links,
        authFactory: authFactory
          ? () => authFactory(inject(Injector))
          : authFactory,
        translationFactory: translationFactory
          ? () => translationFactory(inject(Injector))
          : translationFactory,
        canAny,
      });
    },
    deps: [Injector],
  } as Provider;
}
