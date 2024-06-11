import { MainNavComponent } from './main-nav.component';

/**
 * Exported standalone directives of this library
 */
export const MAIN_NAV_DIRECTIVES = [MainNavComponent];

/**
 * Exported angular providers
 */
export {
  /** @deprecated */
  provideAppLinks as provideHeaderLinks,
  provideAppLinks,
} from './providers';

/**
 * Exported type declarations
 */
export {
  Link,
  ScopedLink,
  UILink,
  /** @deprecated */
  AppLink as HeaderLink,
  /**@deprecated */
  AppLinks as HeaderLinks,
  AppLink,
  AppLinks,
  HRefType,
} from './types';

export { APP_LINKS } from './tokens';
