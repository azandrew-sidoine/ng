import { DataComponent } from './base';
import { FormComponent } from './form';
import { ListComponent } from './list';
import { ViewComponent } from './view';
export { ListComponent } from './list';
export { FormComponent } from './form';
export { DataComponent } from './base';
export { ViewComponent } from './view';
export {} from './rx';
export { canDeactivateComponent } from './guards';
export {
  GridDetailColumnType,
  GridDetailColumnTypes,
} from '@azlabsjs/ngx-clr-smart-grid';
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
} from './core';

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
