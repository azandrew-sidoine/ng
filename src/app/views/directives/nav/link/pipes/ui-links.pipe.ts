import { Pipe, PipeTransform } from '@angular/core';
import { Link, UILink } from '../types';

@Pipe({
  standalone: true,
  name: 'uiLinks',
})
export class UILinksPipe implements PipeTransform {
  transform(values: Link[]) {
    if (typeof values === 'undefined' || values === null) {
      return [];
    }
    return values.map((link) => {
      const { label, cssClass, icon, href } = link as Link;
      return {
        label,
        icon,
        cssClass: cssClass ?? '',
        href: href ?? '#',
      } as UILink;
    });
  }
}
