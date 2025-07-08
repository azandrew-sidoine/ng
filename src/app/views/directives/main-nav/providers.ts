import { Injector, Provider, inject } from '@angular/core';
import { APP_LINKS } from './tokens';
import { AppLinks, HasScopeFactory, TranslationFactory } from './types';
import { Observable, isObservable, map, of, withLatestFrom } from 'rxjs';
import { Link } from '../link';

/** @description provides app links token using angular provide- syntax instead of ngModule providers */
export function provideAppLinks(p: {
  links: AppLinks;
  hasScopes?: HasScopeFactory | null;
  translations?: TranslationFactory | null;
}) {
  return {
    provide: APP_LINKS,
    useFactory: () => {
      const { links, translations, hasScopes } = p;
      const i = inject(Injector);

      // first we resolve all link labels to be translated

      function getNames(p: AppLinks) {
        const y: string[] = [];
        function decorated(links: AppLinks) {
          for (const item of links) {
            y.push(item.label);
            if ('links' in item) {
              decorated(item.links ?? ({} as AppLinks));
            }
          }
        }

        decorated(p);

        return y;
      }

      const factory = translations
        ? translations(i)
        : () => of({}) as Observable<{ [k: string]: any }>;

      // check if implementation below can be moved to app module
      let hasScopes$ = of(() => true) as Observable<
        (scopes: string[]) => boolean
      >;

      if (hasScopes) {
        const result = hasScopes(i);
        hasScopes$ = isObservable(result) ? result : of(result);
      }

      // returns the translation value
      return factory(Array.from(new Set(getNames(links)))).pipe(
        withLatestFrom(hasScopes$),
        map(([values, hasScopes]) => {
          // then we rebuild the link dimension with the translated labels
          const _rewriteLinks = (params: AppLinks, _baseHref: string) => {
            const _links: Link[] = [];
            for (const _link of params) {
              // Case user cannot handle a given scope, we proceed to next link in the iteration
              if (!hasScopes(_link.scopes ?? [])) {
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
              // case _scopeFn returns true, we add the links to the
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
