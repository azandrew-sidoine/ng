import { ViewComponent } from './view.component';

export {
  configResolver,
  provideConfigResolver,
  provideUrlConfigResolver,
} from './resolvers';
export { provideRoutesViewConfigs, provideViewConfigs } from './providers';
export { ViewComponent } from './view.component';

/** Exported lazy loading route factory */
export { createRoutes } from './routes';

/** Exported standalone directives */
export const VIEW_DIRECTIVES = [ViewComponent] as const;
