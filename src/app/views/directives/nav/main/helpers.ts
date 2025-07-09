import { Route } from '@angular/router';
import { Injector } from '@angular/core';
import { AppLinks } from './types';

/** @description Creates Application routes using the link configuration */
export function createAppRoutes<T = any>(links: AppLinks<T>) {
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

  const _routes$ = (_links: AppLinks<T>, _parentHref: string) => {
    for (const _link of _links) {
      const { routeConfig, href, scopes, config } = _link;
      let _href = _hrefToPath(href);

      // We first insert the child routes in order to follow angular recommendations
      // on routing we state to add more specific routes before general routes
      if (
        (_link as { links: AppLinks })['links'] &&
        typeof _href === 'string'
      ) {
        _routes$((_link as { links: AppLinks<T> })['links'], _href);
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
          routeConfig.implicit === true && path && config
            ? {
                ...routeConfig,
                path: _routeRef.startsWith('/')
                  ? _routeRef.substring(1)
                  : _routeRef,
                data: { ..._data, scopes: scopes ?? [] },
                loadChildren: () =>
                  import('../../data/view/routes').then((m) =>
                    m.createRoutes(config as any, {
                      ..._data,
                      scopes: scopes ?? [],
                    })
                  ),
                resolve: _resolve,
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
