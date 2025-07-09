import { InjectionToken } from '@angular/core';
import { Exporter, ProgressHandler } from './types';

/** Progress updater for export action */
export const EXPORT_PROGRESS = new InjectionToken<ProgressHandler<any>>(
  'Progress updater for export action'
);

/** Injectable instance of records export service */
export const EXPORT_SERVICE = new InjectionToken<Exporter>(
    'Provides an implementation for exporting records'
  );
  