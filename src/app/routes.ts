import { environment } from '../environments/environment';
import { DataConfigArgType } from './views/directives/data';
import { AppLinks } from './views/directives/main-nav';

/** @description Application routes definition */
export const LINKS: AppLinks<DataConfigArgType> = [
  {
    label: 'Tableau de board',
    href: '/dashboard/home',
    cssClass: '',
    routeConfig: {
      implicit: false,
      loadChildren: () => import('./views/modules/dashboard/routes'),
      data: {
        name: environment.name,
      },
      providers: [],
    },
  },
  {
    label: 'Examples',
    href: '/dashboard/examples',
    cssClass: '',
    routeConfig: {
      implicit: false,
      loadChildren: () => import('./views/modules/example/routes'),
      data: {
        name: environment.name,
      },
      providers: [],
    },
  },
];
