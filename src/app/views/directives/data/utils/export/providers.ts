import { Provider } from '@angular/core';
import { SheetExporter } from './sheets';
import { EXPORT_SERVICE } from './tokens';
import { Writer } from './types';

/**
 * Provides spreadsheet exporter injection token
 *
 * @param writer
 */
export function provideSheetsExporter(writer: Writer) {
  return {
    provide: EXPORT_SERVICE,
    useFactory: () => {
      return new SheetExporter(writer);
    },
  } as Provider;
}
