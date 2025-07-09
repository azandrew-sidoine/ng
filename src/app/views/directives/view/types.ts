import { InjectionToken } from '@angular/core';

/** view layout type declaration */
export type ViewLayout = 'sidenav' | 'default';

/** @internal */
export type Theme = 'basic'| 'light';

/** View Layout injected token */
export const VIEW_LAYOUT = new InjectionToken<ViewLayout>(
  'View Layout injected token'
);

/** application metadata type declaration */
export type AppMetadataType = {
  logo?: string;
  primaryColor?: string;
  name?: string;
  version?: string;
  theme: Theme
};

/** application Medatadata injection token */
export const APP_METADATA = new InjectionToken<AppMetadataType>(
  'Application Medatadata injection token'
);
