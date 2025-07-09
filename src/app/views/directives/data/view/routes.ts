import { Data, Route } from '@angular/router';
import { ViewComponent } from './view.component';
import { BuiltTypeArgType } from '../core';
import { provideConfigResolver, provideUrlConfigResolver } from './resolvers';
import { Injector, Type } from '@angular/core';

/** @internal */
type ComponentOutletType = {
  component: Type<any>;
  inputs?: Record<string, unknown>;
  module?: Type<any>;
  injector?: Injector;
  content?: any[][];
};

/** @internal */
type ComponentDataType = Data & {
  search?: ComponentOutletType;
  actions?: ComponentOutletType;
};

/** Angular routing lazy loading factory function */
export function createRoutes(
  config: string | BuiltTypeArgType,
  data?: ComponentDataType
) {
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
      data,
    },
  ] as Route[];
}
