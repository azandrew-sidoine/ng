import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  DIRECTIVES,
  PaginateResult,
  ProjectPaginateQueryOutputType,
  ProjectPaginateQueryParamType,
  SearchableGridColumnType,
} from '@azlabsjs/ngx-clr-smart-grid';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
  tap,
  throwError,
} from 'rxjs';
import { GridDataQueryProvider } from './datagrid.query.service';
import { defaultPaginateQuery } from './defaults';
import { DataGridStateType, PipeTransformType, RestQueryType } from './types';
import { Intercept, NextCallback, usePaginatePipeline } from './rx';
import { DATAGRID_CONFIG } from './tokens';
import {
  QueryStateType as QueryState,
  queryResult,
  useQuery,
} from '@azlabsjs/rx-query';
import {
  remove,
  parseSearchDateValue,
  replace,
  projectPaginateQuery,
  createDateQueryParamPipe,
} from './helpers';
import { CommonModule } from '@angular/common';

/** @internal */
const _defaultState = {
  placeholder: undefined as string | undefined,
};

/** @internal */
const NOT_FOUND = "We couldn't load data due to request error ...";

/** @internal */
const LOADING = 'Loading data, please wait ...';

/** @internal */
type StateType = typeof _defaultState;

/** @internal */
type SetStateParamType<T> = ((state: T) => T) | Partial<T>;

@Component({
  imports: [CommonModule, ...DIRECTIVES],
  providers: [GridDataQueryProvider],
  selector: 'ngx-datagrid',
  templateUrl: './datagrid.component.html',
  styles: [
    `
      .dg-header-container {
        margin: 10px 0 0 0;
      }
      :host ::ng-deep .row.inactive {
        background-color: var(--row-inactive, #cacaca);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges {
  // #region Component inputs
  @Input('page-size-options') sizeOptions = this.gridConfig
    ?.pageSizeOptions ?? [10, 20, 50, 100, 150];
  @Input({ alias: 'page-size' }) pageSize = this.gridConfig?.pageSize ?? 10;
  @Input({ alias: 'overflow' }) overflowRef!: TemplateRef<any> | undefined;
  @Input({ alias: 'action-bar' }) actionBarRef!: TemplateRef<any> | undefined;
  @Input({ alias: 'detail-pane' }) detailPaneRef!: TemplateRef<any> | undefined;
  @Input({ alias: 'loading-text' }) loadingtext = LOADING;
  @Input({ alias: 'error-text' }) errorText = NOT_FOUND;
  @Input() placeholder = "We couldn't find any data!";
  @Input() url!: string;
  @Input() columns: SearchableGridColumnType[] = [];
  @Input() query: RestQueryType | undefined;
  @Input() filters: { property: string; value: unknown }[] = [];
  @Input() intercept!:
    | Intercept<ProjectPaginateQueryOutputType, PaginateResult<unknown>>
    | undefined;
  @Input() loading!: boolean;
  @Input({ alias: 'state' }) dgState: ProjectPaginateQueryParamType =
    defaultPaginateQuery;
  @Input({ alias: 'search-value' }) search!: string | null | undefined;
  @Input({ alias: 'column-title-transform' }) transformColumnTitle!:
    | PipeTransformType
    | PipeTransformType[];
  @Input() selectable!: boolean;
  @Input({ alias: 'class' }) cssClass?: string;
  @Input({ alias: 'single-selection' }) singleSelection!: boolean;
  @Input({ alias: 'row-class' }) rowClass!: string | ((element: any) => string);
  // #endregion Component inputs

  // #region Component outputs
  @Output('detail-change') detailChange = new EventEmitter<unknown>();
  @Output('selected-change') selectedChange = new EventEmitter<unknown>();
  @Output('cached-query') cachedQuery = new EventEmitter<QueryState>();
  @Output('refresh-grid') refreshGrid = new EventEmitter<boolean>();
  @Output() dgStateChange = new EventEmitter<ProjectPaginateQueryParamType>();
  @Output() dgItemClick = new EventEmitter<unknown>();
  @Output() performingAction = new EventEmitter<boolean>();
  @Output() queryChange = new EventEmitter<ProjectPaginateQueryOutputType>();
  // #endregion Component outputs

  // #region Component properties / states
  private _dgChanges$ = new Subject<ProjectPaginateQueryParamType>();
  dgState$!: Observable<
    Required<
      PaginateResult<{
        [k: string]: any;
      }>
    >
  >;
  private _search$ = new Subject<string | undefined | null>();
  private subscriptions: Subscription[] = [];

  get overflow() {
    return typeof this.overflowRef !== 'undefined' && this.overflowRef !== null;
  }
  get detailed() {
    return (
      typeof this.detailPaneRef !== 'undefined' && this.detailPaneRef !== null
    );
  }

  _state: StateType = _defaultState;
  get state() {
    return this._state;
  }
  private _gridConfig!: DataGridStateType;
  get gridConfig() {
    return this._gridConfig;
  }
  // #endregion Component properties / states

  /**
   * Creates an angular component instance
   */
  constructor(
    private queryProvider: GridDataQueryProvider,
    private changesRef: ChangeDetectorRef,
    @Inject(DATAGRID_CONFIG) @Optional() gridConfig?: DataGridStateType
  ) {
    // Initialize grid config with default values
    this._gridConfig = gridConfig ?? {
      pagination: { page: 'page', perPage: 'per_page' },
      pageSizeOptions: [10, 20, 50, 100],
      sort: { order: 'order', by: 'by', ascending: '1', descending: '-1' },
      pageSize: 10,
    };
    // #region Handle search query
    const subscription = this._search$
      .asObservable()
      .pipe(
        debounceTime(500),
        map((value) =>
          value
            ? this.columns
                .filter((column) => true === Boolean(column.searcheable))
                .map((column) => ({
                  // TODO: review implementation to use property field
                  property:
                    column.field ??
                    (column as any).label ??
                    (column as any).property,
                  value: encodeURI(value),
                }))
            : []
        ),
        map((filters) => ({
          page: {
            current: 1,
            size:
              this.dgState.page?.size ??
              this.pageSize ??
              defaultPaginateQuery.page?.size,
          },
          filters,
        })),
        tap((query) => this._dgChanges$.next(query))
      )
      .subscribe();
    // #endregion Handle search query
    this.subscriptions.push(subscription);

    // Subscribe to HTTP requests and dispatch performing action event
    // on emitted streams
    const subscription2 = this.queryProvider.performingRequest$
      .pipe(tap((value) => this.performingAction.emit(value)))
      .subscribe();
    this.subscriptions.push(subscription2);
  }

  ngOnInit(): void {
    this.dgState$ = this._dgChanges$.pipe(
      tap(() => {
        this.setState((state) => ({
          ...state,
          placeholder: this.loadingtext,
        }));
      }),
      map((query) => {
        let f = (this.filters ?? [])
          .concat(this.query?._filters ?? [])
          .concat(query?.filters ?? []);
        const columns = this.columns.map(
          // Because current implementation support Legacy and new Datagrid column
          // we try to load property field value or fallback to label field value
          (c) => c['field'] ?? (c as any)['property'] ?? (c as any)['label']
        );
        f = f.filter((value) => columns.includes(value['property']));

        const output = {
          ...query,
          filters: this.prepareSearchFilters(f),
        };

        return output;
      }),
      debounceTime(200),
      map((project) => {
        const params = replace(
          replace(
            replace(
              remove(this.query ?? {}, '_filters'),
              '_excepts',
              '_hidden[]',
              (value) => value ?? []
            ),
            '_columns',
            '_columns[]',
            (value) => value ?? ['*']
          ),
          '_query',
          '_query',
          (value) => JSON.stringify(value ?? {})
        );
        let query = projectPaginateQuery(
          [],
          createDateQueryParamPipe(),
          this._gridConfig
        )(project);

        // We append the column and hidden query parameters to the request params
        if (params) {
          query = { ...query, ...params };
        }
        return query;
      }),
      usePaginatePipeline(
        this.getIntercept(),
        (query) =>
          useQuery(this.queryProvider, this.url, query)
            .pipe(
              tap((value: QueryState) =>
                this.cachedQuery.emit(value)
              ) as OperatorFunction<unknown, QueryState>,
              queryResult()
            )
            .pipe(tap((result) => {}) as any) as Observable<
            PaginateResult<unknown>
          >
      ),
      map((result) => {
        result = result ?? { data: [], total: 0 };
        const _result = Array.isArray(result)
          ? { data: result, total: result.length }
          : result;
        return {
          ..._result,
          data: _result?.data ?? [],
          total: _result?.total ?? _result?.data.length,
        } as Required<PaginateResult<{ [k: string]: any }>>;
      }),
      tap((result) => {
        this.setState((state) => ({
          ...state,
          placeholder:
            result.total && result.total === 0 ? this.placeholder : undefined,
        }));
      }),
      catchError((error) => {
        this.setState((state) => ({
          ...state,
          placeholder: this.errorText,
        }));
        return throwError(() => error);
      })
    );
  }

  /** @description  Listen for changes to trigger request */
  ngOnChanges(changes: SimpleChanges): void {
    if ('url' in changes || 'query' in changes || 'filters' in changes) {
      this.onDgRefresh();
    }
    if (
      'dgState' in changes &&
      typeof this.dgState !== 'undefined' &&
      this.dgState !== null
    ) {
      this.dgRefreshListener(this.dgState);
    }

    if (
      'search' in changes &&
      typeof this.search !== 'undefined' &&
      this.search !== null
    ) {
      this._search$.next(this.search);
    }

    // Refresh the datagrid whenever the filters input changes
    if ('filters' in changes && !!changes['filters'].currentValue) {
      const filters = changes['filters'].currentValue;
      this.dgRefreshListener({
        ...(this.dgState ?? {}),
        filters: Object.keys(filters).reduce((carr, curr) => {
          carr.push({
            property: curr,
            value: encodeURI(filters[curr]),
          });
          return carr;
        }, [] as { property: string; value: unknown }[]),
      });
    }
  }

  // Listen for datagrid refresh event
  dgRefreshListener(event: ProjectPaginateQueryParamType) {
    // Emit the datagrid state changes
    this.dgStateChange.emit(event);
    this._dgChanges$.next(event);
  }

  onDgRefresh() {
    this.refreshGrid.emit(true);
  }

  private setState(value: SetStateParamType<StateType>) {
    const _callback =
      typeof value === 'function'
        ? value
        : (_state: StateType) => ({ ...this.state, ...value });

    this._state = _callback(this._state);
    this.changesRef!.markForCheck();
  }

  private getIntercept() {
    return typeof this.intercept !== 'undefined' && this.intercept !== null
      ? this.intercept
      : (traveler: any, next$: NextCallback<any, any>) => {
          return next$(traveler);
        };
  }

  /** @description Prepares search query filters */
  private prepareSearchFilters(
    queries: { property: string; value: unknown }[]
  ) {
    const queryFilters: { property: string; value: unknown }[] = [];
    for (const query of queries) {
      const { value, property } = query;
      const column = this.columns.find((value) => {
        const k: string =
          value.field ?? (value as any).label ?? (value as any).property;
        return k === query.property;
      });
      if (!column) {
        queryFilters.push(query);
        continue;
      }
      let _value =
        column.searcheable && column.search?.type === 'date'
          ? parseSearchDateValue(String(value))
          : value;
      _value =
        column.searcheable && column.search?.flexible
          ? `${_value}`
          : `&&:${_value}`;
      queryFilters.push({ property, value: _value });
    }
    return queryFilters;
  }

  onDgItemClick(event: unknown) {
    this.dgItemClick.emit(event);
  }

  //
  ngOnDestroy(): void {
    // TODO: Do referenced resource cleanup
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
