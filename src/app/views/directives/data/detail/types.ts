import { GridDetailColumnType } from '@azlabsjs/ngx-clr-smart-grid';

/** @internal */
export type ColumnType = Omit<GridDetailColumnType, 'style'> & {
  style: {
    styles?: Record<string, boolean>;
    cssClass?: string;
  };
};
