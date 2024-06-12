import { Routes } from '@angular/router';
import { createAppRoutes } from './views/directives/main-nav';
import { LINKS } from './routes';
import { provideUrlConfigResolver } from './views/directives/data';

export const routes: Routes = [
  // Default routes
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Application routes
  ...createAppRoutes(
    LINKS,
    './views/directives/data/view/routes',
    provideUrlConfigResolver()
  ),

  // Fallback route
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
