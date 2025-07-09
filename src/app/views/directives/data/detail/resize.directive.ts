/** This directive tries to mimic the table layout of the browser by
 * automatically resizing table cell width based on the total number
 * cell per/row and the size of the largest cell
 */

import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  Directive,
  ElementRef,
  Inject,
  Input,
  Optional,
} from '@angular/core';

@Directive({
  selector: '[resize]',
  standalone: true,
})
export class ResizeDirective implements AfterViewChecked {
  @Input({ alias: 'resize' }) title: string | null | undefined;

  constructor(
    private el: ElementRef,
    @Optional() @Inject(DOCUMENT) private document?: Document | null
  ) {}

  //
  ngAfterViewChecked(): void {
    const t = setTimeout(() => {
      const element = this.el.nativeElement as HTMLTableElement;
      const { defaultView } = this.document ?? {};
      const computedStyle = defaultView?.getComputedStyle(element);

      // Case the directive is not applied on an HTML table element we simply return
      if (
        typeof element.rows === 'undefined' ||
        typeof element.rows?.item !== 'function' ||
        element.rows === null
      ) {
        return;
      }

      // Directive implementation only cares for display property block
      // because if the display is table, the browser API will automatically line
      // up the table row based on the size of the table
      const display =
        element.style.display.trim() === ''
          ? computedStyle?.display
          : element.style.display;
  
      if (display && display.toLowerCase() !== 'block') {
        return;
      }

      let maxWidth: number = 0;
      const tableWidth = element.getBoundingClientRect().width;

      // Find and update the maxWidth value based on the width
      // of each cell in the provided table
      for (let index = 0; index < element.rows.length; index++) {
        const current = element.rows.item(index);
        if (!current) {
          continue;
        }
        const total = current.cells.length;
        for (let i = 0; i < total; i++) {
          const cell = current.cells.item(i);
          if (!cell) {
            continue;
          }
          maxWidth = Math.max(
            cell.getBoundingClientRect().width,
            tableWidth / total
          );
        }
      }

      if (maxWidth === 0) {
        return;
      }

      for (let index = 0; index < element.rows.length; index++) {
        const current = element.rows.item(index);
        if (!current) {
          continue;
        }
        for (let i = 0; i < current.cells.length; i++) {
          const cell = current.cells.item(i);
          if (!cell) {
            continue;
          }
          cell.setAttribute('width', `${maxWidth}`);
        }
      }
      clearTimeout(t);
    }, 0);
  }
}
