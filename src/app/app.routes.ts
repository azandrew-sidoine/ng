import { Router, Routes } from '@angular/router';
import { createAppRoutes } from './views/directives/main-nav';
import { LINKS } from './routes';
import { Injector } from '@angular/core';
// import { SignInResultInterface } from './views/login';
import { environment } from '../environments/environment';

export const routes: Routes = [
  // Default routes
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () => import('./views/login/ui/routes'),
    data: {
      path: (injector: Injector) => {
        // Passed in as second parameter
        // _: SignInResultInterface
        // TODO: update the code is dashboard might change based on user's privileges
        return injector.get(Router).navigateByUrl('/dashboard/home');
      },
      moduleName: environment.name,
    },
  },

  // Application routes
  ...createAppRoutes(LINKS),

  // Fallback route
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
