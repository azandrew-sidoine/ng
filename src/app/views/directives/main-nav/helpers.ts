import { ResolveFn, Route } from '@angular/router';
import { Injector } from '@angular/core';
import { Observable, map, of, withLatestFrom } from 'rxjs';
import { AppLinks, AuthFactory, TranslationFactory } from './types';
import { Link } from '../link';

/** @description Creates Application routes using the link configuration */
export function createAppRoutes(
  links: AppLinks,
  implicitViewPath: string,
  configResolver: ResolveFn<any>
) {
  const routes: Route[] = [];
  const _hrefToPath = (
    _href: string | ((injector: Injector) => void | Promise<void>)
  ) => {
    return typeof _href === 'function'
      ? _href
      : _href.startsWith('/')
      ? _href.substring(1)
      : _href;
  };

  const _routes$ = (_links: AppLinks, _parentHref: string) => {
    for (const _link of _links) {
      const { routeConfig, href, scopes } = _link;
      let _href = _hrefToPath(href);

      // We first insert the child routes in order to follow angular recommendations
      // on routing we state to add more specific routes before general routes
      if (
        (_link as { links: AppLinks })['links'] &&
        typeof _href === 'string'
      ) {
        _routes$((_link as { links: AppLinks })['links'], _href);
      }

      if (routeConfig && typeof _href === 'string') {
        const _routeRef = _href as string;
        const { path, data, resolve } = routeConfig;
        _href = path ?? _hrefToPath(href);

        if (!_routeRef.startsWith('/')) {
          _parentHref = _parentHref.endsWith('/')
            ? _parentHref.substring(0, _parentHref.length - 1)
            : _parentHref;
          _href = `${_parentHref}/${_href}`;
        }

        const _data = data ?? {};
        const _resolve = resolve ?? {};

        routes.push(
          routeConfig.implicit === true && path
            ? {
                ...routeConfig,
                path: _routeRef.startsWith('/')
                  ? _routeRef.substring(1)
                  : _routeRef,
                data: { ..._data, scopes: scopes ?? [] },
                loadChildren: () => import(implicitViewPath),
                resolve: { ..._resolve, config: configResolver },
              }
            : {
                ...routeConfig,
                path: _routeRef.startsWith('/')
                  ? _routeRef.substring(1)
                  : _routeRef,
                data: { ..._data, scopes: scopes ?? [] },
              }
        );
      } else if (typeof _href === 'string') {
        if (!_href.startsWith('/')) {
          _parentHref = _parentHref.endsWith('/')
            ? _parentHref.substring(0, _parentHref.length - 1)
            : _parentHref;
          _href = `${_parentHref}/${_href}`;
        }
      }
    }

    return routes;
  };

  const result = Array.from(new Set(_routes$(links, '/')));

  return result;
}

/** @internal Provides the topbar links observable */
export function appLinks(p: {
  links: AppLinks;
  authFactory?: AuthFactory | null;
  translationFactory?: TranslationFactory | null;
  canAny?: (v: { scopes: string[] }, ...s: string[]) => boolean;
}) {
  return (injector: Injector) => {
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
    const { links, translationFactory, authFactory, canAny } = p;

    const translations$ = translationFactory
      ? translationFactory(injector)?.get(
          Array.from(new Set(_translations(links)))
        )
      : (of({}) as Observable<Record<string, any>>);

    // Check if implementation below can be moved to app module
    const tokenCan$ = authFactory
      ? authFactory(injector).signInState$.pipe(
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
                label: values[_l.label],
                links:
                  typeof _href === 'string'
                    ? _rewriteLinks((_l as { links: AppLinks })['links'], _href)
                    : (_l as { links: AppLinks })['links'],
              });
            } else {
              _links.push({ ..._l, href: _href, label: values[_l.label] });
            }
          }
          return _links;
        };
        const result = _rewriteLinks(links, '/');

        return result;
      })
    );
  };
}
