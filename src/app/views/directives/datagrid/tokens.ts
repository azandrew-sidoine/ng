import { InjectionToken } from '@angular/core';
import { ProvideDatagridConfigType } from './types';

/** @description Datagrid pagination configurations token */
export const DATAGRID_CONFIG = new InjectionToken<ProvideDatagridConfigType>(
  'Datagrid pagination configurations token'
);
