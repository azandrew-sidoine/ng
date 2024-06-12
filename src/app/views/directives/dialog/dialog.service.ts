import { Inject, Injectable, Optional } from '@angular/core';
import { Dialog } from './types';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BrowSerDialog implements Dialog {
  private view!: Window;

  // class constructor
  constructor(@Inject(DOCUMENT) @Optional() document?: Document) {
    const { defaultView } = document ?? {};
    this.view = defaultView as Window & typeof globalThis;
  }

  // confirm implementation
  confirm(message: string): Promise<boolean> {
    if (
      typeof this.view !== 'undefined' &&
      this.view !== null
    ) {
      return new Promise((resolve) => {
        resolve(this.view.confirm(message));
      });
    }

    return Promise.reject(
      'Browser is expected for the dialog box implementation'
    );
  }
}
