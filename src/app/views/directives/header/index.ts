import { HeaderActionsComponent } from './actions/actions.component';
import { HeaderComponent } from './header.component';
import { HeaderNavLinkComponent } from './nav/nav-link.component';
import { HeaderNavComponent } from './nav/nav.component';

/** Exported standalone directives */
export const HEADER_DIRECTIVES = [
  HeaderComponent,
  HeaderActionsComponent,
  HeaderNavComponent,
  HeaderNavLinkComponent,
] as const;

/** Exported angular providers */
export { provideHeaderActions } from './providers';