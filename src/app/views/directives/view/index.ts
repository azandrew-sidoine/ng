import { ViewComponent } from './view.component';

/**
 * View directives
 */
export const VIEW_DIRECTIVES = [ViewComponent] as const;

/**
 * Exported angular providers
 */
export { provideViewLayout, provideAppMetadata } from './providers';


/**
 * Exported types declarations
 */
export { ViewLayout, VIEW_LAYOUT, AppMetadataType } from './types';
