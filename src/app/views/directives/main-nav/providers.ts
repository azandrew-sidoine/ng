import { Injector, Provider, inject } from '@angular/core';
import { APP_LINKS } from './tokens';
import { AppLinks, AuthFactory, TranslationFactory } from './types';
import { Observable, map, of, withLatestFrom } from 'rxjs';
import { Link } from '../link';

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
      const i = inject(Injector);

      // First we resolve all link labels to be translated
      const labels: string[] = [];
      const _translations = (_links: AppLinks) => {
        for (const _link of _links) {
          labels.push(_link.label);
          if ((_link as { links: AppLinks })['links']) {
            _translations((_link as { links: AppLinks })['links']);
          }
        }
        return labels;
      };

      const translations$ = translationFactory
        ? translationFactory(i)?.get(Array.from(new Set(_translations(links))))
        : (of({}) as Observable<Record<string, any>>);

      // Check if implementation below can be moved to app module
      const tokenCan$ = authFactory
        ? authFactory(i).signInState$.pipe(
            map((state) => state?.scopes),
            map((scopes) => (s: string[]) => {
              s = s ?? [];
              const fn = canAny ?? (() => true);
              return s.length === 0 ? true : fn({ scopes: scopes ?? [] }, ...s);
            })
          )
        : of(() => true);

      // Returns the translation value
      return translations$.pipe(
        withLatestFrom(tokenCan$),
        map(([values, _scopeFn]) => {
          // Then we rebuild the link dimension with the translated labels
          const _rewriteLinks = (params: AppLinks, _baseHref: string) => {
            const _links: Link[] = [];
            for (const _link of params) {
              // Case user cannot handle a given scope, we proceed to next link in the iteration
              if (!_scopeFn(_link.scopes ?? [])) {
                continue;
              }
              const { scopes, href, ..._l } = _link;
              // memoize href into _href variable
              let _href = href;

              if (typeof href === 'string' && !href.startsWith('/')) {
                _baseHref = _baseHref.endsWith('/')
                  ? _baseHref.substring(0, _baseHref.length - 1)
                  : _baseHref;
                _href = `${_baseHref}/${href}`;
              }
              // Case _scopeFn returns true, we add the links to the
              if ((_l as { links: AppLinks })['links']) {
                _links.push({
                  ..._l,
                  href: _href,
                  label: values[_l.label] ?? _l.label,
                  links:
                    typeof _href === 'string'
                      ? _rewriteLinks(
                          (_l as { links: AppLinks })['links'],
                          _href
                        )
                      : (_l as { links: AppLinks })['links'],
                });
              } else {
                _links.push({
                  ..._l,
                  href: _href,
                  label: values[_l.label] ?? _l.label,
                });
              }
            }
            return _links;
          };
          const result = _rewriteLinks(links, '/');

          return result;
        })
      );
    },
  } as Provider;
}
