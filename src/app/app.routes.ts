import { Routes } from '@angular/router';
import { LINKS } from './routes';
import { createAppRoutes } from './views/directives/nav';

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
