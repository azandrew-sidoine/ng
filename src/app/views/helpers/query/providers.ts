import { HttpClient, HttpParams } from '@angular/common/http';
import { Provider, inject } from '@angular/core';
import { HTTP_QUERY_CLIENT, HTTPClientType, QUERY_CLIENT } from './types';
import {
  CacheQueryConfig,
  ObserveKeyType,
  QueryProviderType,
  useDefaultCacheConfig,
} from '@azlabsjs/rx-query';
import { BuilderType, QueryResultType } from './builder';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { createQueryResult } from './utils';
import { RequestMethod } from './http';

// @internal
type _CacheQueryConfig =
  | boolean
  | (CacheQueryConfig & {
      observe?: ObserveKeyType;
      name: string;
    });

/** @internal query client type declaration */
class _Client implements QueryProviderType<[BuilderType]> {
  public readonly cacheConfig!: CacheQueryConfig & {
    name?: string;
  };

  // class constructor declaration
  constructor(
    private http: HTTPClientType,
    config?: boolean | _CacheQueryConfig
  ) {
    if (typeof config === 'boolean' && config === true) {
      this.cacheConfig = {
        ...useDefaultCacheConfig(),
        // name: `query::bindTo[${name}]`,
      };
    }

    if (typeof config === 'object' && config !== null) {
      const { name } = config;
      this.cacheConfig = {
        ...config,
        name: `query::bindTo[${name}]`,
      };
    }
  }

  query(
    builder: BuilderType
  ): Observable<QueryResultType<Record<string, unknown>>> {
    return this.http
      .request('GET', builder.getPath(), {
        params: new HttpParams({
          fromObject: {
            _query: JSON.stringify(builder.getQuery()),
            '_columns[]': builder.getColumns(),
            '_hidden[]': builder.getExcepts(),
          },
        }),
        responseType: 'json',
      })
      .pipe(map((result) => createQueryResult(result)));
  }
}

/** @internal HTTP query client type declaration */
class _HTTPClient
  implements
    QueryProviderType<
      [
        string,
        RequestMethod | undefined | null,
        Record<string, any> | undefined | null
      ]
    >
{
  public readonly cacheConfig!: CacheQueryConfig & {
    name?: string;
  };

  // class constructor declaration
  constructor(
    private http: HTTPClientType,
    config?: boolean | _CacheQueryConfig
  ) {
    if (typeof config === 'boolean' && config === true) {
      this.cacheConfig = {
        ...useDefaultCacheConfig(),
        // name: `query::bindTo[${name}]`,
      };
    }

    if (typeof config === 'object' && config !== null) {
      const { name } = config;
      this.cacheConfig = {
        ...config,
        name: `query::bindTo[${name}]`,
      };
    }
  }

  // query implementation method
  query(
    url: string,
    method?: RequestMethod | null,
    params?: Record<string, any> | null,
    d?: unknown
  ): Observable<unknown> {
    return this.http
      .request(method ?? 'GET', url, {
        params: new HttpParams({ fromObject: params ?? {} }),
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          // case a default value is provided as parameter, we return the
          // default value, else we throw an error
          return d ? of(d) : throwError(() => err);
        })
      ) as Observable<unknown>;
  }
}

/** @description angular provider for query builder client sdk */
export function provideQuery(config: _CacheQueryConfig) {
  return {
    provide: QUERY_CLIENT,
    useFactory: () => {
      const http = inject(HttpClient) as HTTPClientType;
      return new _Client(http, config);
    },
  } as Provider;
}

/** @description angular provider for query builder client sdk */
export function provideHttpQuery(config: _CacheQueryConfig) {
  return {
    provide: HTTP_QUERY_CLIENT,
    useFactory: () => {
      const http = inject(HttpClient) as HTTPClientType;
      return new _HTTPClient(http, config);
    },
  } as Provider;
}
