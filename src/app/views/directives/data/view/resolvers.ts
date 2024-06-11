import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ConfigType } from '../core';
import {
  ArgType,
  BuiltTypeArgType,
  createBuiltTypeDataConfig,
  createDataConfig,
} from '../core/builders';
import { inject } from '@angular/core';
import { VIEWS_CONFIG } from './tokens';
import { map } from 'rxjs';

/**
 *
 * Resolve config input for page component using angular router resolver.
 *
 * **Usage**
 *
 * ```ts
 * const routes: Route[] = [
 *      {
 *          path: '/dashboard/examples',
 *          component: ViewComponent,
 *          resolve: {config: configResolver},
 *          data: {
 *              _config: {
 *                  _type: Example,
 *                  url: 'http://127.0.0.1:3000/api/v1/examples',
 *                  datagrid: {
 *                      transformColumnTitle: ['translate', 'uppercase'],
 *                      // Grid columns configurations
 *                      columns: gridColumns,
 *                  }
 *              }
 *           }
 *      }
 * ];
 * ```
 */
export const configResolver: ResolveFn<ConfigType | null> = (
  route: ActivatedRouteSnapshot
) => {
  const value: BuiltTypeArgType | ArgType = route.data['_config'];

  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  if ((value as BuiltTypeArgType)._type) {
    return createBuiltTypeDataConfig(value as BuiltTypeArgType);
  }

  return createDataConfig(value as ArgType);
};

/**
 *
 * Resolve config input for page component using angular router resolver.
 *
 * **Usage**
 *
 * ```ts
 * const routes: Route[] = [
 *      {
 *          path: '/dashboard/examples',
 *          component: ViewComponent,
 *          resolve: {
 *                config: provideConfigResolver({
 *                  _type: Example, // Not required if no type builder should be provided
 *                  url: 'http://127.0.0.1:3000/api/v1/examples',
 *                  datagrid: {
 *                      transformColumnTitle: ['translate', 'uppercase'],
 *                      // Grid columns configurations
 *                      columns: gridColumns,
 *                  }
 *              })
 *          }
 *      }
 * ];
 * ```
 */
export const provideConfigResolver =
  (value: BuiltTypeArgType | ArgType): ResolveFn<ConfigType | null> =>
  (_: ActivatedRouteSnapshot) => {
    if (typeof value === 'undefined' || value === null) {
      return null;
    }
    return (value as BuiltTypeArgType)._type
      ? createBuiltTypeDataConfig(value as BuiltTypeArgType)
      : createDataConfig(value as ArgType);
  };

/**
 *
 * Resolve config input for page component using angular router resolver.
 * This resolver assume library has been configured with page configurations using `provideDataViewConfigs(...)`.
 *
 * **Usage**
 *
 * ```ts
 * const routes: Route[] = [
 *      {
 *          path: '/dashboard/examples',
 *          component: NgxDataPageComponent,
 *          resolve: {
 *                config: provideUrlConfigResolver('/dashboard/examples')
 *          }
 *      }
 * ];
 * ```
 */
export const provideUrlConfigResolver =
  (url?: string): ResolveFn<ConfigType | null> =>
  (_: ActivatedRouteSnapshot) => {
    try {
      const pageConfigs = inject(VIEWS_CONFIG);
      return pageConfigs.pipe(
        map((item) => {
          const _path = _.url.join('/');

          // Creates an absolute from activated route _path
          url = url ?? `/${_path.startsWith('/') ? _path.substring(1) : _path}`;

          // Find the page configuration url parameter
          const result = item.find((current) => current.href === url);
          if (typeof result === 'undefined' || result === null) {
            return null;
          }

          // Resolve the configuration
          if ((result.config as BuiltTypeArgType)._type) {
            return createBuiltTypeDataConfig(result.config as BuiltTypeArgType);
          }
          return createDataConfig(result.config as ArgType);
        })
      );
    } catch {
      return null;
    }
  };
