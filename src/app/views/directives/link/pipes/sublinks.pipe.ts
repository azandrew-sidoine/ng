import { Pipe, PipeTransform } from '@angular/core';
import { HRefType, Link } from '../types';

@Pipe({
  name: 'sublinks',
  standalone: true,
  pure: true,
})
export class SublinksPipe implements PipeTransform {
  transform(values: Link[], href: HRefType): Link[] {
    if (typeof values === 'undefined' || values === null) {
      return [];
    }

    if (
      typeof href === 'undefined' ||
      href === null ||
      typeof href === 'function'
    ) {
      return [];
    }

    let _link = values.find((l) => l.href === href);

    if (_link) {
      return _link.links ?? [];
    }

    const _href = href.startsWith('/') ? href : `/${href}`;

    _link = values.find(
      // (l) =>
      (l) => typeof l.href === 'string' && _href.startsWith(l.href)
    );

    // Case the href equals a child link, the current link children are is returned
    if (_link) {
      return _link.links ?? [];
    }

    return [];
  }
}
