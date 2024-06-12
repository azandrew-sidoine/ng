import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

/** @description Resolve the route data for activated route */
export function data<T = any>(
  route: ActivatedRoute,
  prop: string,
  _default?: T
) {
  return route.snapshot.data[prop] ?? _default;
}

/** @description Resolves an observable route data value */
export function data$<T = any>(
  route: ActivatedRoute,
  prop: string,
  _default?: T
): Observable<T | undefined> {
  return route.data.pipe(map((state) => state[prop] ?? _default));
}
