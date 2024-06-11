import { ViewComponent } from './view.component';

/** @descriptionView directives */
export const VIEW_DIRECTIVES = [ViewComponent] as const;

/** @description Exported angular providers */
export { provideViewLayout, provideAppMetadata } from './providers';

/** @description Exported types declarations */
export { ViewLayout, VIEW_LAYOUT, AppMetadataType } from './types';
