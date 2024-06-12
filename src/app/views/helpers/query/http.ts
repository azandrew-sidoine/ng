import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ProvidesQuery,
  QueryProviderType,
  as,
  useQuery,
} from '@azlabsjs/rx-query';
import { Observable, catchError, of, throwError } from 'rxjs';

/** @description Type declaration of an http request method */
export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'GET'
  | 'DELETE'
  | 'OPTION'
  | 'HEAD';

@Injectable({
  providedIn: 'root',
})
@ProvidesQuery({
  observe: 'body',
  refetchInterval: 1800000,
  cacheTime: 900000,
})
export class HTTPQueryProvider
  implements
    QueryProviderType<[string, RequestMethod, Record<string, any> | undefined]>
{
  // Class constructor
  constructor(private http: HttpClient) {}

  // Query implementation method
  query(
    url: string,
    method: RequestMethod,
    params?: Record<string, any>,
    _default?: unknown
  ): Observable<unknown> {
    return this.http
      .request(method, url, {
        params: new HttpParams({ fromObject: params ?? {} }),
        responseType: 'json',
      })
      .pipe(
        catchError((err) => {
          // Case a default value is provided as parameter, we return the
          // default value, else we throw an error
          return _default ? of(_default) : throwError(() => err);
        })
      ) as Observable<unknown>;
  }
}

/**
 * Provides an HTTP query observable that caches data for optimization
 * and refetch updates each 30 min
 *
 * @param provider
 * @param url
 * @param method
 * @param params
 */
export const useHTTPQuery = <T>(
  provider: QueryProviderType<
    [string, RequestMethod, Record<string, any> | undefined],
    unknown | undefined
  >,
  url: string,
  method: RequestMethod = 'GET',
  params?: Record<string, any>
) => as<Observable<T>>(useQuery(provider, url, method, params));
