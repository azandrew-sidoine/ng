import { InjectionToken } from '@angular/core';
import { BuilderType } from './builder';
import { QueryProviderType } from '@azlabsjs/rx-query';
import { Observable } from 'rxjs';

/** @description HTTP Query client injection Token */
export const HTTP_QUERY_CLIENT = new InjectionToken<
  QueryProviderType<[BuilderType]>
>('HTTP Query client injection Token');

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
          };
      withCredentials?: boolean;
      observe?: 'response' | 'body' | 'request';
    }
  ): Observable<T>;
};
