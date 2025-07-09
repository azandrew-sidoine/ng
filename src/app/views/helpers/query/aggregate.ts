import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryProviderType } from '@azlabsjs/rx-query';
import { Observable, map } from 'rxjs';

/** @description Aggregation query type declaration */
type AggregationQuery = {
  column: string;
  params: string | string[];
  query?: Record<string, unknown>;
  method: 'count' | 'min' | 'max' | 'sum' | 'avg';
};

@Injectable()
export class AggregateQuery
  implements QueryProviderType<[string, AggregationQuery, unknown]>
{
  // Class constructor
  constructor(private http: HttpClient) {}

  // Send query to the backend server
  query(url: string, value: AggregationQuery, _default?: unknown) {
    let { column: select, params, query, method } = value;

    // Case the query is
    const _query = query ?? ({} as Record<string, unknown>);

    return this.http
      .request('GET', url, {
        params: new HttpParams({
          fromObject: {
            _query: JSON.stringify({
              ..._query,
              aggregate: {
                [method]: params,
              },
              limit: 1,
            }),
            '_columns[]': [select],
            '_hidden[]': 'id',
          },
        }),
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          const result = response['data'] ? response['data'][0] : response[0];
          return result ? result[select] : _default;
        })
      );
  }
}

/**
 * Aggregation query method factory
 *
 * @param provider
 * @param url
 */
export function useAggregation<T>(
  provider: QueryProviderType<[string, AggregationQuery, unknown]>,
  url: string
) {
  return (query: AggregationQuery, _default?: unknown) => {
    return provider.query(url, query, _default) as Observable<T>;
  };
}
