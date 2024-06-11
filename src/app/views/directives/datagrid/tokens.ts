import { InjectionToken } from '@angular/core';
import { PagingConfig } from './types';

/** @description Datagrid pagination configurations token */
export const DATAGRID_CONFIG = new InjectionToken<PagingConfig>(
  'Datagrid pagination configurations token'
);
