// import { DetailViewComponent } from './views/modules/directives';
// import { viewColumns as healthCareDetailColumns } from './views/modules/healthcares/columns';
import { AppLinks } from './views/directives/nav';
import { environment } from '../environments/environment';
import { DataConfigArgType } from './views/directives/data';

const { name } = environment;

/** @description Application routes definition */
export const LINKS: AppLinks<DataConfigArgType> = [
  {
    label: 'links.dashboard',
    href: '/dashboard/home',
    cssClass: '',
    routeConfig: {
      implicit: false,
      loadChildren: () => import('./views/modules/dashboard/routes'),
      data: { name },
    },
  },
  // healthcares
  {
    label: 'links.examples',
    href: '/dashboard/examples',
    cssClass: '',
    routeConfig: {
      implicit: false,
      loadChildren: () => import('./views/modules/example/routes'),
      data: { name },
    },
  },
];
