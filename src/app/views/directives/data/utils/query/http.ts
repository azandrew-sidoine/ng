import {
  Observable,
  Subscription,
  asyncScheduler,
  catchError,
  map,
  mergeMap,
  of,
  tap,
  throwError,
  timer,
} from 'rxjs';

/** Page result type declaration */
export type PageResult<T = unknown> = {
  total: number;
  data: T[];
  page?: number;
};

/**
 * @internal
 *
 * Create pagination url based on user provided parameters
 */
export function createPageUrl(
  endpoint: string,
  page: number,
  per_page: number
) {
  endpoint = endpoint ?? '';
  if (endpoint.indexOf('?') === -1) {
    endpoint += '?';
  }
  if (endpoint.indexOf('per_page') === -1) {
    // The per_page request query is set to be a number between
    // 100 - 1000 just for optimization and server performance purpose
    const _query = `page=${page}&per_page=${Math.min(per_page, 500)}`;

    // Append the query to the end of the endpoint value
    endpoint += endpoint.endsWith('?') ? _query : `&${_query}`;
  }
  return endpoint;
}

/**
 * @internal
 */
export function createPaginationChunk(
  total: number,
  perPage: number,
  size: number
) {
  let pages = parseInt(Math.floor(total / perPage).toFixed(), 10);
  const remaining = total % perPage;
  // Add another page if there is a remaining in the division operation
  if (remaining !== 0) {
    pages += 1;
  }
  // We slice from index 1 to rermove the first page as it has already been
  // queried
  const list = Array.from(new Array(pages).keys())
    .slice(1)
    .map((item) => item + 1);

  // #region Create 2 dimensional array
  const chunks: number[][] = [];
  for (let index = 0; index < list.length; index += size) {
    chunks.push(list.slice(index, index + size));
  }
  // #endregion Create 2 dimensional array

  return chunks;
}

/**
 * @internal
 * Actual page request for each page chunk with delay
 */
function usePageRequestObservable<T>(_delay: number, page: number) {
  return (
    queryFunc: (page: number) => Observable<T[]>,
    resultFn: (values: T[]) => void,
    thenFn: () => void,
    errorFn: (err: any) => void
  ) => {
    return timer(_delay, asyncScheduler)
      .pipe(
        mergeMap(() => queryFunc(page).pipe(tap((result) => resultFn(result)))),
        catchError((err) => {
          errorFn(err);
          return throwError(() => err);
        }),
        map(() => thenFn())
      )
      .subscribe();
  };
}

/** @internal */
export function queryPaginationate<T = Record<string, unknown>>(
  queryFunc: (page: number) => Observable<T[]>,
  total: number,
  perPage: number,
  size: number,
  delay?: number
) {
  return (
    chunkFn: typeof createPaginationChunk,
    resultFn: (values: T[]) => void,
    doneFn: () => void
  ) => {
    // For the first chunk we do not provide any delay
    const pagesChunk: number[][] = chunkFn(total, perPage, size);
    let _delay = 0;

    // Create a requests array with the initial request
    const requests: Subscription[] = [];
    // subscriptions
    // For each chunk add the request to the initial requests
    let refCount = pagesChunk.flat().length - 1;
    for (const pages of pagesChunk) {
      _delay += delay ?? 1000;
      // Because index reference might change before the request completes,
      // we pass the current index value to the chunk query observable function
      // and wait for the complete result for the current iteration index
      for (const page of pages) {
        const _subscription = usePageRequestObservable<T>(_delay, page)(
          queryFunc,
          resultFn,
          () => {
            // Case reference count is down to 0, we unsubscribe from the observables
            if (refCount === 0) {
              doneFn();
            }
            refCount--;
          },
          () => {
            // Decrement the reference count event when error occurs
            refCount--;
          }
        );
        requests.push(_subscription);
      }
    }

    // Return a forl join of all requests
    return requests;
  };
}

/**
 * Creates a select query function that send request in parallel to server
 * but actually defers concurrent requests based on interval in order to
 * avoid rate limiting error from server
 */
export function useSelectAll(
  path: string,
  params?: Record<string, any>,
  chunkSize: number = 5,
  _interval: number = 1000,
  perPage: number = 500
) {
  return (
    requestFn: (
      path: string,
      params?: Record<string, any>
    ) => Observable<PageResult<Record<string, unknown>>>,
    onStream: (values: Record<string, unknown>[], total: number) => void,
    onComplete: () => void
  ) => {
    // First thing first, we query for the first page of the collection
    // The result of the first page query is expected to return a pgaination instance
    // and we use the pagination result meta data to query for the remaining pages
    const request$ = requestFn(createPageUrl(path, 1, perPage), params);
    const subscriptions: Subscription[] = [];
    const _completeFn = (subs: Subscription[]) => {
      for (const subscription of subs) {
        if (subscription) {
          subscription.unsubscribe();
        }
      }

      // Checks if user provide a complete function.
      // Case user provide a complete handler, we call the complete handler
      if (onComplete) {
        onComplete();
      }
    };

    return request$.pipe(
      catchError(() => {
        return of({ data: [] as Record<string, unknown>[] } as PageResult<
          Record<string, unknown>
        >);
      }),
      tap((response) => {
        const items = ((response) => response.data)(response);
        // When the first page of data is loaded, we call the callback function
        // with the loaded data with the partial flag turns on
        const total = Number(response.total ?? 0);

        // Case item is a list of item, we call the caller onResult
        if (Array.isArray(items)) {
          onStream(items, total);
        }

        if (
          total !== 0 &&
          // Add a condition that checks if the total items
          // is not greater than the length of the list of query result items
          Number(response.total) > items.length
        ) {
          // Provide a query result factory
          const queryFunc$ = (page: number) =>
            requestFn(createPageUrl(path, page, perPage), params).pipe(
              catchError(() => {
                return of({
                  data: [] as Record<string, unknown>[],
                } as PageResult<Record<string, unknown>>);
              }),
              map((response: any) => response.data)
            );

          // Execute the pagination request
          const queries = queryPaginationate(
            queryFunc$,
            response.total,
            perPage,
            chunkSize,
            _interval
          )(
            createPaginationChunk,
            (values: Record<string, unknown>[]) => onStream(values, total),
            () => _completeFn(subscriptions)
          );
          subscriptions.push(...queries);
        } else {
          _completeFn(subscriptions);
        }
      }),
      map(() => true)
    );
  };
}
