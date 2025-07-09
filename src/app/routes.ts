import { getObjectProperty } from '@azlabsjs/js-object';

// import { DetailViewComponent } from './views/modules/directives';
// import { viewColumns as healthCareDetailColumns } from './views/modules/healthcares/columns';
import { AppLinks } from './views/directives/nav';
import { environment } from '../environments/environment';
import { DataConfigArgType } from './views/directives/data';
import healthcaresViewConfig from './views/modules/healthcares';

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

  {
    label: 'links.healthcares',
    href: '/dashboard/healthcares',
    cssClass: '',
    routeConfig: {
      implicit: false,
      loadChildren: () =>
        import('./views/directives/data/view/routes').then((m) =>
          m.createRoutes(
            healthcaresViewConfig(
              getObjectProperty(
                environment,
                'api.endpoints.healthcares.url'
              ) as string,
              {
                _query: null,
                _columns: [
                  '*',
                  'healthcareMedicalPrescriptions',
                  'healthcareDiseases',
                  'healthcareMedicalPrescriptionDeliveries',
                  'prescribedProducts',
                  'healthcareMedicalProcedures',
                ],
              }
            ),
            {
              exceptions: {
                grid: [
                  'id',
                  'category_id',
                  'updated_at',
                  'status',
                  'synchronized',
                  'created_by',
                  'usage_count',
                  'pat_right_holder_type_id',
                  'consult_reason_id',
                ],
                detail: ['id', 'created_by', 'synchronized', 'usage_count'],
              },
              name,
              module: 'healthcares',
              // search: {
              //   component: MembersSearchComponent,
              // },
            }
          )
        ),
      // canActivateChild: [canActivateChild],
    },
    links: [],
  },
];
