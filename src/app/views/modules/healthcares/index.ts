import { Healthcare } from './types';
import { /*form,*/ createFormConfig } from './form';
import { gridColumns, viewColumns as detailColumns } from './columns';
import { ActionType } from '../../directives/data';

export default <T extends Record<string, any> = any>(
  url: string,
  query?: { [k: string]: any },
  template?: { detail: T }
) => {
  const { detail } = template ?? {};
  return {
    _type: Healthcare,
    url,
    form: {
      noGridLayout: false,
      //# TODO: Add custom handlers
      value: createFormConfig(url), // form  // replace `createFormConfig` with `form` to use constant form declaration
    },
    datagrid: {
      transformColumnTitle: ['text', 'uppercase'],
      columns: gridColumns,
      query,
      detail: detailColumns,
    },
    detail,
    excludesActions: ['create' /* 'update', 'delete'*/] as ActionType[],
  };
};

// Exported types declarations
export * from './form';
export * from './types';
