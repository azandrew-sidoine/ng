import { HttpClient } from '@angular/common/http';
import { PaginateResult } from '@azlabsjs/ngx-clr-smart-grid';
import { QueryProviderType, ProvidesQuery } from '@azlabsjs/rx-query';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

// @ProvidesQuery({
//   observe: 'query',
//   cacheTime: 300000,
// })
@Injectable()
export class GridDataQueryProvider
  implements QueryProviderType<[string, Record<string, any>]>
{
  private _performingRequest$ = new BehaviorSubject<boolean>(false);
  public readonly performingRequest$ = this._performingRequest$.asObservable();

  // Creates instance of the class
  constructor(private http: HttpClient) {}

  query<T>(
    path: string,
    query: Record<string, any>
  ): Observable<PaginateResult<T>> {
    this._performingRequest$.next(true);
    return (
      this.http.get(path, { params: query }) as Observable<PaginateResult<T>>
    ).pipe(
      tap(() => this._performingRequest$.next(false)),
      catchError((err) => {
        this._performingRequest$.next(false);
        return throwError(() => err);
      })
    );
  }
}
