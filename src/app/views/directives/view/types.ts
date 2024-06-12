import { InjectionToken } from '@angular/core';

/**
 * View layout type declaration
 */
export type ViewLayout = 'sidenav' | 'default';

/**
 * View Layout injected token
 */
export const VIEW_LAYOUT = new InjectionToken<ViewLayout>(
  'View Layout injected token'
);

/**
 * Application metadata type declaration
 */
export type AppMetadataType = {
  logo?: string;
  primaryColor?: string;
  name?: string;
  version?: string;
};

/**
 * Application Medatadata injection token
 */
export const APP_METADATA = new InjectionToken<AppMetadataType>(
  'Application Medatadata injection token'
);
