import { Injector, Provider, inject } from '@angular/core';
import { Dialog } from './types';
import { DIALOG } from './tokens';
import { BrowSerDialog } from './dialog.service';

/** @description Provides an angular provider for displaying a dialog box */
export function provideDialog(
  factory?: ((injector: Injector) => Dialog) | Dialog
) {
  return {
    provide: DIALOG,
    useFactory: () => {
      const dialog = inject(BrowSerDialog);
      const injector = inject(Injector);
      return factory
        ? typeof factory === 'function' && factory !== null
          ? factory(injector)
          : factory
        : dialog;
    },
  } as Provider;
}
