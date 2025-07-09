import { SearchableGridColumnType } from '@azlabsjs/ngx-clr-smart-grid';
import { CacheQueryConfig, ObserveKeyType } from '@azlabsjs/rx-query';

/** @internal */
export type PipeTransformType = string | ((value: any) => any) | undefined;

/** @internal */
export type CacheConfigType = CacheQueryConfig & {
  name: string;
  observe?: ObserveKeyType;
};

/** @description Pagination parameter configuration type declaration */
export type PagingConfig = {
  page: string;
  perPage: string;
};

/** @internal */
export type DataGridStateType = {
  pageSizeOptions?: number[];
  pageSize?: number;
  pagination: PagingConfig;
  sort?: Partial<{
    asQuery?: boolean;
    order: string;
    by: string;
    /** @description Provides string used as value for ascending order */
    ascending: '1' | 'asc' | string;
    /** @description Provides string used as value for descending order */
    descending: '-1' | 'desc' | string;
  }>;
};

/** @description REST API Query type */
export type RestQueryType = {
  _columns?: string[];
  _excepts?: string[];
  _filters?: { property: string; value: unknown }[];
  _query?: { [k: string]: any };
};

/** @description Grid Config Type declaration template */
export type GridConfigType<T extends Function> = {
  url: string;
  datagrid: {
    columns: SearchableGridColumnType[];
    query: RestQueryType;
  };
  project: T;
};

/** @internal */
export type ProvideDatagridConfigType = DataGridStateType & {
  cache?: CacheQueryConfig;
};
