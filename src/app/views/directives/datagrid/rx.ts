import { Observable, switchMap } from 'rxjs';
import {
  PaginateResult,
  ProjectPaginateQueryOutputType,
  ProjectPaginateQueryParamType,
} from '@azlabsjs/ngx-clr-smart-grid';

/**  @internal */
export type NextCallback<T, R> = (source: T) => Observable<R>;

/**  @internal */
export type Intercept<T = unknown, R = unknown> = (
  traveler: T,
  next$: NextCallback<T, R>
) => ReturnType<typeof next$>;

/** @description `actionPipeline` generic operator specification for datagrid pagination */
export function usePaginateActionPipeline$<T>(
  intercept: Intercept<ProjectPaginateQueryParamType, PaginateResult<T>>,
  next$: (input: ProjectPaginateQueryParamType) => Observable<PaginateResult<T>>
) {
  return (traveler: Observable<ProjectPaginateQueryParamType>) => {
    return traveler.pipe(
      switchMap((value) =>
        intercept(value, ((current) => next$(current)) as NextCallback<
          any,
          PaginateResult<T>
        >)
      )
    );
  };
}

/** @description `actionPipeline` generic operator specification for datagrid pagination */
export function usePaginatePipeline<T>(
  intercept: Intercept<ProjectPaginateQueryOutputType, PaginateResult<T>>,
  next$: (
    input: ProjectPaginateQueryOutputType
  ) => Observable<PaginateResult<T>>
) {
  return (traveler: Observable<ProjectPaginateQueryOutputType>) => {
    return traveler.pipe(
      switchMap((value) =>
        intercept(value, ((current) => next$(current)) as NextCallback<
          any,
          PaginateResult<T>
        >)
      )
    );
  };
}
