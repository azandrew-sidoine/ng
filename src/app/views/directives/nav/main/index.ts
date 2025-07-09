import { MainNavComponent } from './main-nav.component';

/** @description Exported standalone directives of this library */
export const MAIN_NAV_DIRECTIVES = [MainNavComponent] as const;

/**
 * Exported angular providers
 */
export { provideAppLinks } from './providers';

/**
 * Exported type declarations
 */
export {
  ScopedLink,
  /** @deprecated */
  AppLink as HeaderLink,
  /**@deprecated */
  AppLinks as HeaderLinks,
  AppLink,
  AppLinks,
  HRefType,
} from './types';

export { APP_LINKS } from './tokens';

/** Factory function for creating application routes */
export { createAppRoutes } from './helpers';
