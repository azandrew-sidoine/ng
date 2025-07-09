import { Injector, Provider, inject } from '@angular/core';
import { UIEventsController } from './ui-events-controller';
import { REACTIVE_UI_EVENTS_CONTROLLER, UI_EVENTS_CONTROLLER } from './tokens';
import {
  ReactiveUIEventsControllerType,
  UIEventsControllerType,
} from './types';
import { ReactiveUIEventsController } from './reactive-ui-events-controller';

/** @deprecated Provides UI state controller instance */
export function provideUIEventsController(
  controller?: (injector: Injector) => UIEventsControllerType
) {
  const _controller =
    controller ?? ((i: Injector) => i.get(UIEventsController));
  return {
    provide: UI_EVENTS_CONTROLLER,
    useFactory: () => {
      return _controller(inject(Injector));
    },
  } as Provider;
}

/** @deprecated Provides an observable based UI state controller instance */
export function provideReactiveUIEventsController(
  controller?: (injector: Injector) => ReactiveUIEventsControllerType
) {
  const _controller =
    controller ?? ((i: Injector) => i.get(ReactiveUIEventsController));
  return {
    provide: REACTIVE_UI_EVENTS_CONTROLLER,
    useFactory: () => {
      return _controller(inject(Injector));
    },
  } as Provider;
}
