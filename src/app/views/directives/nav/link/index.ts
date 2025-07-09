import { LinkComponent } from './link.component';
import { SublinksPipe, UILinksPipe } from './pipes';

/** Exported directives */
export const LINK_DIRECTIVE = [
  LinkComponent,
  SublinksPipe,
  UILinksPipe,
] as const;

/** Exported type declatations */
export { UILink, Link } from './types';


/** Exported link pipes */
export { SublinksPipe, UILinksPipe } from './pipes';