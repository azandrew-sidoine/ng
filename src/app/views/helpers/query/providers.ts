import { HttpClient } from '@angular/common/http';
import { Provider, ProviderToken, inject } from '@angular/core';
import { HTTPClientType, HTTP_QUERY_CLIENT } from './types';
import {
  CacheQueryConfig,
  ObserveKeyType,
  QueryProviderType,
  useDefaultCacheConfig,
} from '@azlabsjs/rx-query';
import { BuilderType, QueryResultType } from './builder';
import { Observable, map } from 'rxjs';
import { createQueryResult } from './utils';

/** @internal */
type CacheConfigType = CacheQueryConfig & {
  name: string;
  observe?: ObserveKeyType;
};

/** @internal Query client type declaration */
class Client implements QueryProviderType<[BuilderType]> {
  get cacheConfig(): CacheConfigType {
    return this._cacheConfig;
  }

  // Class constructor declaration
  constructor(
    private client: HTTPClientType,
    private _cacheConfig: CacheConfigType
  ) {}

  query(
    builder: BuilderType
  ): Observable<QueryResultType<Record<string, unknown>>> {
    return this.client
      .request('GET', builder.getPath(), {
        params: {
          _query: JSON.stringify(builder.getQuery()),
          '_columns[]': builder.getColumns(),
          '_hidden[]': builder.getExcepts(),
        },
        responseType: 'json',
      })
      .pipe(map((result) => createQueryResult(result, 'data')));
  }
}

/** @description Creates a cache configuration object from parameters*/
function createCacheConfig<T extends Record<string, any>>(
  config: T,
  name: string
) {
  return {
    ...(typeof config === 'boolean' && config === true
      ? useDefaultCacheConfig()
      : config),
    observe: 'body',
    name: `query::bindTo[${name}]`,
  } as T & { name: string; observe: ObserveKeyType };
}

/** @description Angular provider for HTTP query client sdk */
export function provideQueryClient(
  client?: ProviderToken<HTTPClientType>,
  config?: CacheQueryConfig
) {
  return {
    provide: HTTP_QUERY_CLIENT,
    useFactory: () => {
      return new Client(
        client ? inject(client) : (inject(HttpClient) as HTTPClientType),
        createCacheConfig(
          config ?? {
            refetchInterval: 1800000,
            cacheTime: 900000,
          },
          'QueryClient'
        )
      );
    },
  } as Provider;
}