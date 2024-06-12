import { DataComponent } from './base';
import { FormComponent } from './form';
import { ListComponent } from './list';
import { ViewComponent } from './view';
export { ListComponent } from './list';
export { FormComponent } from './form';
export { DataComponent } from './base';
export { ViewComponent } from './view';
export { canDeactivateComponent } from './guards';
export {
  ConfigType,
  ActionsConfigType,
  ActionType,
  CommonStringsType,
  NextCallback,
  DataComponentType,
  DataUpdateHandler,
  DataCreateHandler,
  DataDeleteHandler,
  ViewStateComponentType,
  StateType,
  ActionHandler,
  CreateActionPayload,
  UpdateActionPayload,
  DeleteActionPayload,
  actionPipeline$,
  buildRessouceUrl,
  mapInto,
  createBuiltTypeDataConfig,
  createDataConfig,
  provideOverflowHttpActionHandler,
  provideActionBarHttpActionHandler,
  provideActionBarActionHandler,
  provideOverflowActionHandler,
  DataConfigArgType,
  BuiltTypeArgType,
  ArgType,
  columsTranslatorFactory,
} from './core';

export {
  /** @deprecated use `GridDetailColumnType` from `@azlabsjs/ngx-clr-smart-grid` */
  GridDetailColumnType,
  /** @deprecated use `GridDetailColumnTypes` from `@azlabsjs/ngx-clr-smart-grid` */
  GridDetailColumnTypes,
} from '@azlabsjs/ngx-clr-smart-grid';

export {
  provideViewConfigs,
  provideRoutesViewConfigs,
  provideConfigResolver,
  provideUrlConfigResolver,
  createRoutes,
} from './view';

/** Exported standalone directives */
export const DIRECTIVES = [
  ListComponent,
  DataComponent,
  FormComponent,
  ViewComponent,
] as const;
