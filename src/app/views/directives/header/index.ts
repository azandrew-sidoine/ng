import { HeaderActionsComponent } from './actions/actions.component';
import { HeaderComponent } from './header.component';
import { HeaderNavLinkComponent } from './nav/nav-link.component';
import { HeaderNavComponent } from './nav/nav.component';

// Export standalone directives
export const HEADER_DIRECTIVES = [
  HeaderComponent,
  HeaderActionsComponent,
  HeaderNavComponent,
  HeaderNavLinkComponent,
] as const;

// Exported providers
export { provideHeaderActions } from './actions';