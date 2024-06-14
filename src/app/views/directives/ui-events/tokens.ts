import { InjectionToken, inject } from '@angular/core';
import {
  ReactiveUIEventsControllerType,
  UIEventsControllerType,
} from './types';
import { UIEventsController } from './ui-events-controller';
import { ReactiveUIEventsController } from './reactive-ui-events-controller';

/** @description UI Events controller injection token */
export const UI_EVENTS_CONTROLLER = new InjectionToken<UIEventsControllerType>(
  'UI Events controller provider type definition',
  {
    providedIn: 'root',
    factory: () => inject(UIEventsController),
  }
);

/** @description Reactive UI Events controller injection token */
export const REACTIVE_UI_EVENTS_CONTROLLER =
  new InjectionToken<ReactiveUIEventsControllerType>(
    'Reactive UI Events controller provider type definition',
    {
      providedIn: 'root',
      factory: () => inject(ReactiveUIEventsController),
    }
  );
