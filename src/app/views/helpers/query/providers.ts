import { HttpClient } from '@angular/common/http';
import { Provider, inject } from '@angular/core';
import { HTTPClientType, HTTP_QUERY_CLIENT } from './types';
import { ProvidesQuery, QueryProviderType } from '@azlabsjs/rx-query';
import { BuilderType, QueryResultType } from './builder';
import { Observable, map } from 'rxjs';
import { createQueryResult } from './utils';

/** @internal Query client type declaration */
@ProvidesQuery({
  observe: 'body',
  refetchInterval: 1800000,
  cacheTime: 900000,
})
export class Client implements QueryProviderType<[BuilderType]> {
  // Class constructor declaration
  constructor(private client: HTTPClientType) {}

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
      .pipe(map((result) => createQueryResult(result)));
  }
}

/** @description Angular provider for HTTP query client sdk */
export function provideQueryClient() {
  return {
    provide: HTTP_QUERY_CLIENT,
    useFactory: () => {
      return new Client(inject(HttpClient) as HTTPClientType);
    },
  } as Provider;
}
