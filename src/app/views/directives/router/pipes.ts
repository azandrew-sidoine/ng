import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getObjectProperty } from '@azlabsjs/js-object';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'asyncRouteData',
  pure: true,
  standalone: true,
})
export class AsyncRouteDataPipe implements PipeTransform {
  /** @description Creates class instances */
  constructor(private route: ActivatedRoute) {}

  transform<T = any>(property: string): Observable<T | null> {
    return this.route.data.pipe(
      map((d) => (getObjectProperty(d, property) ?? null) as T | null)
    );
  }
}

@Pipe({
  name: 'routeData',
  pure: true,
  standalone: true,
})
export class RouteDataPipe implements PipeTransform {
  /** @description Creates class instances */
  constructor(private route: ActivatedRoute) {}

  transform<T = any>(property: string): T | null {
    return (getObjectProperty(this.route.snapshot.data, property) ??
      null) as T | null;
  }
}

@Pipe({
  name: 'asyncQueryParam',
  pure: true,
  standalone: true,
})
export class AsyncQueryParamPipe implements PipeTransform {
  /** @description Creates class instances */
  constructor(private route: ActivatedRoute) {}

  transform(property: string): Observable<string | null> {
    return this.route.queryParamMap.pipe(map((p) => p.get(property) ?? null));
  }
}

@Pipe({
  name: 'queryParam',
  pure: true,
  standalone: true,
})
export class QueryParamPipe implements PipeTransform {
  /** @description Creates class instances */
  constructor(private route: ActivatedRoute) {}

  transform(property: string): string | null {
    return this.route.snapshot.queryParamMap.get(property);
  }
}

/** Exported standalone pipes */
export const ROUTER_PIPES = [
  AsyncQueryParamPipe,
  QueryParamPipe,
  AsyncRouteDataPipe,
  RouteDataPipe,
] as const;
