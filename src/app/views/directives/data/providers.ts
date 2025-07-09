import { Provider } from '@angular/core';
import {
  EXPORT_PROGRESS,
  EXPORT_SERVICE,
  ProgressStateType,
  SheetExporter,
  Writer,
} from './utils';
import { BehaviorSubject } from 'rxjs';

/**
 * Angular provider for datagrid export value and percentage updater
 *
 * **Note** it's best to provide it at the root of the application
 *          to make components depend on a single instance.
 */
export function provideProgress() {
  return {
    provide: EXPORT_PROGRESS,
    useFactory: () => {
      return new (class {
        // #region Class reactive properties
        private _state = new BehaviorSubject<ProgressStateType>({
          total: 0,
          value: 0,
        });
        public readonly state$ = this._state.asObservable();
        // #endregion Class reactive properties

        update(fn: (value: ProgressStateType) => ProgressStateType): void {
          this._state.next({ ...fn(this._state.getValue()) });
        }
      })();
    },
  } as Provider;
}

/** Angular provider for exporter */
export function provideSheetsExporter(writer: Writer) {
  return {
    provide: EXPORT_SERVICE,
    useFactory: () => new SheetExporter(writer),
  } as Provider;
}
