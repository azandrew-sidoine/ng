import { ActivatedRoute } from '@angular/router';
import { getObjectProperty } from '@azlabsjs/js-object';
import { Observable, map } from 'rxjs';

/** @description Resolve the route data for activated route */
export function data<T = any>(
  route: ActivatedRoute,
  prop: string,
  _default: T | null = null
) {
  return getObjectProperty(route.snapshot.data, prop) ?? _default;
}

/** @description Resolves an observable route data value */
export function data$<T = any>(
  route: ActivatedRoute,
  prop: string,
  _default: string | null = null
): Observable<T | null> {
  return route.data.pipe(
    map((state) => getObjectProperty(state, prop) ?? _default)
  );
}

/** @description Resolve value for the provided query parameter name */
export function queryParam(
  route: ActivatedRoute,
  prop: string,
  _default: string | null = null
) {
  return route.snapshot.queryParamMap.get(prop) ?? _default;
}

/** @description Resolves an observable query parameter value */
export function queryParam$(
  route: ActivatedRoute,
  prop: string,
  _default: string | null = null
): Observable<string | null> {
  return route.queryParamMap.pipe(map((state) => state.get(prop) ?? _default));
}
