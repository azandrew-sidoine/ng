import { Routes } from '@angular/router';
import { createAppRoutes } from './views/directives/main-nav';
import { LINKS } from './routes';

export const routes: Routes = [
  // Default routes
  {
    path: '',
    redirectTo: 'dashboard/home',
    pathMatch: 'full',
  },

  // Application routes
  ...createAppRoutes(LINKS),

  // Fallback route
  {
    path: '**',
    redirectTo: 'dashboard/home',
    pathMatch: 'full',
  },
];
