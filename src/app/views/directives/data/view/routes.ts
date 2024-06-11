import { Route } from '@angular/router';
import { ViewComponent } from './view.component';
import { BuiltTypeArgType } from '../core';
import { canDeactivateComponent } from '../guards';
import { provideConfigResolver, provideUrlConfigResolver } from './resolvers';

/** Angular routing lazy loading factory function */
export function createRoutes(config: string | BuiltTypeArgType) {
  return [
    {
      path: '',
      component: ViewComponent,
      resolve: {
        config:
          typeof config === 'string'
            ? provideUrlConfigResolver(config)
            : provideConfigResolver(config),
      },
      canDeactivate: [canDeactivateComponent(['/'])],
    },
  ] as Route[];
}
