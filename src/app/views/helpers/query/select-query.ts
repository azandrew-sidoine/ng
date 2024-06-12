import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ProvidesQuery, QueryProviderType } from '@azlabsjs/rx-query';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PageResult, useSelectQuery } from './pagination';

/** @internal Size of pagination chunk */
const CHUNK_SIZE_LIMIT = 5;

@Injectable()
@ProvidesQuery({
  observe: 'body',
  refetchInterval: 3600000,
  cacheTime: 300000,
})
export class SelectQueryProvider
  implements
    QueryProviderType<
      [
        string,
        Record<string, any> | undefined,
        number | undefined,
        number | undefined
      ]
    >,
    OnDestroy
{
  // #region Class properties
  private subscriptions: Subscription[] = [];
  // #endregion Class properties

  // Class constructor
  constructor(private http: HttpClient) {}

  // Query implementation method
  query(
    url: string,
    params?: Record<string, any>,
    _interval?: number,
    _perPage?: number
  ): Observable<any> {
    const subject = new BehaviorSubject<Record<string, unknown>[]>([]);

    // Pipe the request response to the
    const subscription = useSelectQuery(
      url,
      params,
      CHUNK_SIZE_LIMIT,
      _interval ?? 1000,
      _perPage ?? 500
    )(
      (url: string, params?: Record<string, string>) => {
        return this.http.request('GET', url, {
          params: new HttpParams({ fromObject: params ?? {} }),
          responseType: 'json',
        }) as Observable<PageResult<Record<string, unknown>>>;
      },
      (values) => subject.next([...subject.getValue(), ...values]),
      () => subject.complete()
    ).subscribe();

    // Add the subscription to service subscriptions list
    this.subscriptions.push(subscription);

    // Returns the observable instance
    return subject.asObservable();
  }

  // Service destructor
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions ?? []) {
      subscription.unsubscribe();
    }
  }
}
