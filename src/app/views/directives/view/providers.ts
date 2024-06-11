import { Injector, Provider } from '@angular/core';
import {
  APP_METADATA,
  AppMetadataType,
  VIEW_LAYOUT,
  ViewLayout,
} from './types';

/** @description Angular provider for global configuration on the view layout */
export function provideViewLayout(
  layout: ViewLayout | ((injector: Injector) => ViewLayout)
) {
  return {
    provide: VIEW_LAYOUT,
    useFactory: (injector: Injector) => {
      return typeof layout === 'function'
        ? layout(injector)
        : layout ?? 'default';
    },
    deps: [Injector],
  } as Provider;
}

/** @description Angular provider for Application metadata like, name and branding */
export function provideAppMetadata(
  metadata: AppMetadataType | ((injector: Injector) => AppMetadataType)
) {
  return {
    provide: APP_METADATA,
    useFactory: (injector: Injector) => {
      return typeof metadata === 'function' ? metadata(injector) : metadata;
    },
    deps: [Injector],
  } as Provider;
}
