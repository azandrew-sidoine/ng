import { InjectionToken } from '@angular/core';
import { BuilderType } from './builder';
import { QueryProviderType } from '@azlabsjs/rx-query';
import { Observable } from 'rxjs';
import { RequestMethod } from './http';

/** @description query client injection token */
export const QUERY_CLIENT = new InjectionToken<
  QueryProviderType<[BuilderType]>
>('query client injection Token');

/** @description HTTP query client injection token */
export const HTTP_QUERY_CLIENT = new InjectionToken<
  QueryProviderType<[string, RequestMethod, Record<string, any> | undefined]>
>('http query client injection Token');

/** @internal Type definition of an HTTP client */
export type HTTPClientType = {
  request<T = unknown>(
    method: string,
    url: string,
    options: {
      body?: unknown;
      responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
      headers?:
        | Record<string, unknown>
        | {
            [header: string]: string | string[];
          };
      params?:
        | Record<string, unknown>
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          }
        | object;
      withCredentials?: boolean;
      observe?: 'response' | 'body' | 'request';
    }
  ): Observable<T>;
};
