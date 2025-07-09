import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  from,
  isObservable,
  of,
  throwError,
} from 'rxjs';
import {
  ActionConfigType,
  ActionHandler,
  CreateActionPayload,
  CustomActionConfigType,
  DeleteActionPayload,
  RequestClient,
  UpdateActionPayload,
  actionPipeline$,
} from '../core';
import {
  CREATE_ACTION_HANDLER,
  DELETE_ACTION_HANDLER,
  REQUEST_CLIENT,
  UPDATE_ACTION_HANDLER,
} from './tokens';
import {
  EXPORT_PROGRESS,
  EXPORT_SERVICE,
  Exporter,
  ProgressHandler,
  ProgressStateType,
  SheetHeaderType,
  useSelectAll,
} from '../utils';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CustomActionHTTPHandler {
  /** @description Class constructor */
  public constructor(@Inject(REQUEST_CLIENT) private http: RequestClient) {}

  /** @description Handle custom action http handler */
  handle(
    url: string,
    event: unknown,
    action?: CustomActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    // First we call provide a fallback implementation for
    // perpare url case not provided by the configuration
    const prepareUrl = action?.prepareUrl ?? ((_url) => _url);
    // The we call the prepare url on the provided url for the handler
    // to make sure that developper has the ability to change url
    const _url = prepareUrl(url, event);
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (traveler) =>
          from(this.http.request(_url, action?.method ?? 'GET', traveler))
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }
}

@Injectable()
export class DataComponentService implements OnDestroy {
  //#region Class properties
  private subscriptions: Subscription[] = [];
  //#endregion Class properties

  /**
   * Creates data component CRUD service insance
   */
  constructor(
    private http: HttpClient,
    @Inject(DELETE_ACTION_HANDLER)
    private delete$: ActionHandler<DeleteActionPayload, unknown>,
    @Inject(UPDATE_ACTION_HANDLER)
    private update$: ActionHandler<UpdateActionPayload, unknown>,
    @Inject(CREATE_ACTION_HANDLER)
    private create$: ActionHandler<CreateActionPayload, unknown>,
    @Optional()
    @Inject(EXPORT_PROGRESS)
    private progress: ProgressHandler<ProgressStateType> | null,
    @Optional()
    @Inject(EXPORT_SERVICE)
    private exporter: Exporter | null
  ) {}

  //
  create(
    url: string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (body) => {
          const result$ = this.create$.handle({ url, body });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }

  //
  update(
    url: string,
    id: number | string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        (body) => {
          const result$ = this.update$.handle({ id, url, body });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }

  //
  delete(
    url: string,
    id: number | string,
    event: unknown,
    action?: ActionConfigType,
    errorCallback?: (err: unknown) => void
  ) {
    return of(event).pipe(
      actionPipeline$(
        action?.intercept ?? ((traveler, next$) => next$(traveler)),
        () => {
          const result$ = this.delete$.handle({ id, url });
          return isObservable(result$)
            ? (result$ as Observable<unknown>)
            : of(result$);
        }
      ),
      catchError((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        return throwError(() => err);
      })
    );
  }

  export(
    url: string,
    headers: SheetHeaderType[],
    query?: Record<string, unknown>,
    listBuilder?: (values: any[]) => any[]
  ) {
    const records = new BehaviorSubject<Record<string, unknown>[]>([]);
    const builder = listBuilder ?? ((values: any[]) => values);
    // Simulate request start by updating progress by 1%
    this.progress?.update((state) => ({
      ...state,
      total: 100,
      value: 1,
    }));
    // TODO: Handle errors cases
    const subscription = useSelectAll(
      url,
      query,
      2,
      1000,
      300
    )(
      (url: string, params?: Record<string, string>) => {
        return this.http.request('GET', url, {
          params: new HttpParams({ fromObject: params ?? {} }),
          responseType: 'json',
        }) as Observable<any>;
      },
      (values, total) => {
        records.next([...records.getValue(), ...builder(values)]);

        // Case total is provided we updated the progress UI with the total and length
        // of queried values.
        if (typeof total === 'number' && total !== 0) {
          this.progress?.update((state) => ({
            ...state,
            total,
            value: records.getValue().length,
          }));
        }
      },
      () => {
        // When the request is completed, we export the generated data
        this.exporter?.export(records.getValue(), headers);
      }
    ).subscribe();

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }
}
