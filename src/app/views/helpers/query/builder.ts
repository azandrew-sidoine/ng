import { ProvidesQuery, QueryProviderType } from '@azlabsjs/rx-query';
import { Observable, map } from 'rxjs';
import { HTTPClientType } from './types';

/** @description Query builder type declaration */
export type BuilderType = {
  getColumns(): string[];
  getExcepts(): string[];
  getQuery(): Record<string, any>;
  getPath(): string;
};

/** @internal */
type SubQueryReturnType = string | ((_b: Builder) => Builder);

/** @description Query result type declaration */
export type QueryResultType<T> = {
  items: T[];
  all: () => T[];
  first: () => T | null | undefined;
  count: () => number;
};

/** @internal Create a subquery instance */
function createSubquery(
  method: string,
  builder: Builder<Record<string, unknown>>
) {
  return {
    /**
     * return the query method used bind to the parameters list
     */
    getMethod: () => method,

    /**
     * return list of parameters of the subquery
     */
    getParams: () => builder,

    /**
     * Return the json encoded value of the
     */
    getJson: () => ({
      method,
      params: builder.getQuery(),
    }),
  };
}

class Builder<T extends Record<string, any> = Record<string, any>>
  implements BuilderType
{
  // #region Class properties
  private _query: T = {} as T;
  private _columns = ['*'];
  private _excepts: string[] = [];
  private _url!: string;
  private _page!: number;
  private _perPage!: number;
  // #enregion Class properties

  from(url: string) {
    this._url = url;
    return this;
  }

  select(columns: string[] = ['*']) {
    this._columns = this._columns.filter((col) => col !== '*');
    this._columns = Array.from(new Set([...this._columns, ...columns]));
    return this;
  }

  eq(column: string, value: unknown, and: boolean = true) {
    return and ? this.and(column, '=', value) : this.or(column, '=', value);
  }

  neq(column: string, value: unknown, and: boolean = true) {
    return and ? this.and(column, '<>', value) : this.or(column, '<>', value);
  }

  lt(column: string, value: unknown, and: boolean = true) {
    return and ? this.and(column, '<', value) : this.or(column, '<', value);
  }

  lte(column: string, value?: unknown, and: boolean = true) {
    return and ? this.and(column, '<=', value) : this.or(column, '<=', value);
  }

  gt(column: string, value: unknown, and: boolean = true) {
    return and ? this.and(column, '>', value) : this.or(column, '>', value);
  }

  gte(column: string, value: unknown, and: boolean = true) {
    return and ? this.and(column, '>=', value) : this.or(column, '>=', value);
  }

  like(column: string, value: string, and: boolean = true) {
    return and
      ? this.and(column, 'like', value)
      : this.or(column, 'like', value);
  }

  and(column: (_b: Builder) => Builder): Builder;
  and(column: string, op: string, value: unknown): Builder;
  and(column: SubQueryReturnType, op?: string, value?: unknown) {
    if (typeof column === 'function') {
      const _query = createSubquery('and', column(new Builder()));
      this.addQuery('and', [_query.getJson()]);
    } else {
      this.addQuery('and', [column, op, value]);
    }
    return this;
  }

  or(column: (_b: Builder) => Builder): Builder;
  or(column: string, op: string, value: unknown): Builder;
  or(column: SubQueryReturnType, op?: string, value?: unknown) {
    if (typeof column === 'function') {
      const _query = createSubquery('and', column(new Builder()));
      this.addQuery('or', [_query.getJson()]);
    } else {
      this.addQuery('or', [column, op, value]);
    }
    return this;
  }

  date(column: string, op: string, value: unknown) {
    this.addQuery('date', [column, op, value]);
    return this;
  }

  orDate(column: string, op: string, value: string) {
    this.addQuery('orDate', [column, op, value]);
    return this;
  }

  in(column: string, values: unknown[]) {
    this.addQuery('in', [column, values]);
    return this;
  }

  notIn(column: string, values: unknown[]) {
    this.addQuery('notIn', [column, values]);
    return this;
  }

  exists(column: string): Builder;
  exists(column: string, query: SubQueryReturnType): Builder;
  exists(column: string, query?: SubQueryReturnType) {
    this.setExistQuery(column, query);
    return this;
  }

  orExists(column: string): Builder;
  orExists(column: string, query: SubQueryReturnType): Builder;
  orExists(column: string, query?: SubQueryReturnType) {
    this.setExistQuery(column, query, 'orExists');
    return this;
  }

  notExists(column: string): Builder;
  notExists(column: string, query: SubQueryReturnType): Builder;
  notExists(column: string, query?: SubQueryReturnType) {
    this.setExistQuery(column, query, 'notExists');
    return this;
  }

  orNotExists(column: string): Builder;
  orNotExists(column: string, query: SubQueryReturnType): Builder;
  orNotExists(column: string, query?: SubQueryReturnType) {
    this.setExistQuery(column, query, 'orNotExists');
    return this;
  }

  paginate(page: number, perPage: number) {
    this._page = page;
    this._perPage = perPage;
    return this;
  }

  sort(column: string, order: -1 | 1 | 'desc' | 'asc' = -1) {
    this._query = { ...this._query, sort: { order, by: column } };
    return this;
  }

  limit(limit: number) {
    this._query = { ...this._query, limit };
    return this;
  }

  count(column: string = '*', relation?: string) {
    this.addAggregateQuery('count', column, relation);
    return this;
  }

  min(column: string = '*', relation?: string) {
    this.addAggregateQuery('min', column, relation);
    return this;
  }

  max(column: string = '*', relation?: string) {
    this.addAggregateQuery('max', column, relation);
    return this;
  }

  avg(column: string = '*', relation?: string) {
    this.addAggregateQuery('avg', column, relation);
    return this;
  }

  getQuery(): Record<string, unknown> {
    return this._query;
  }

  getColumns(): string[] {
    return this._columns;
  }

  getExcepts(): string[] {
    return this._excepts;
  }

  getPath(): string {
    return this._page && this._perPage
      ? `${this._url}?page=${this._page}&per_page=${this._perPage}`
      : this._url;
  }

  private setExistQuery(
    column: string,
    query?: SubQueryReturnType,
    method: string = 'exists'
  ) {
    const _query =
      typeof query === 'function'
        ? createSubquery('and', query(new Builder())).getJson()
        : query;
    this.addQuery(
      method,
      typeof _query === 'undefined' || _query === null
        ? [column]
        : [{ column, match: _query }]
    );
  }

  private addAggregateQuery(
    method: string,
    column: string = '*',
    relation?: string
  ) {
    this._columns.push(relation ? `${relation}_${method}` : `count_${column}`);
    const aggregate = this._query['aggregate']
      ? { ...this._query['aggregate'] }
      : {};
    if (method in aggregate) {
      aggregate[method].push(relation ? [column, relation] : [column]);
    } else {
      aggregate[method] = [relation ? [column, relation] : [column]];
    }
    this._query = { ...this._query, aggregate: aggregate };
  }

  private addQuery(method: string, query: unknown[]) {
    this._query = {
      ...this._query,
      [method]: (this._query[method] ?? []).concat([query]),
    };
  }
}

/** @description Create a new query builder instance */
export function useBuilder() {
  return new Builder();
}