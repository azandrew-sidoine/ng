import { Pipe, PipeTransform } from '@angular/core';
import { HRefType, Link } from '../types';

// /**
//  * Returns a 1 dimensional array of the list of link items
//  */
// function flattenLinks(links: Link[]) {
//   let _hrefs: (HRefType | undefined)[] = [];
//   const _flatten$ = (_links: Link[]) => {
//     for (const _link of _links) {
//       _hrefs.push(_link.href);
//       if ((_link as { links: Link[] })['links']) {
//         _flatten$((_link as { links: Link[] })['links'] ?? []);
//       }
//     }
//     return _hrefs;
//   };
//   return _flatten$(links ?? []).filter(
//     (v) => typeof v !== 'undefined' && v !== null
//   ) as string[];
// }

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
      // Implementation below tends to be nonsense if routing is properly defined
      // TODO: Uncomment the code below to add the nonsense implementation if required
      //  || (l.links &&
      //   l.links.findIndex(
      //     (ll) => typeof ll.href === 'string' && _href.startsWith(ll.href)
      //   ) !== -1)
    );

    // Case the href equals a child link, the current link children are is returned
    if (_link) {
      return _link.links ?? [];
    }

    return [];
  }
}
