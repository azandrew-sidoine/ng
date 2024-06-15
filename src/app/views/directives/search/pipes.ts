import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'safeHtml',
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {
  /** @description SafeHtmlPipe class constructor */
  constructor(private sanitized: DomSanitizer) {}

  /** @description */
  transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
