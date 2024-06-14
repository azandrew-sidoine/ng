import { Injector, Provider, inject } from '@angular/core';
import { UIStateController } from './ui-state-controller';
import { REACTIVE_UI_STATE_CONTROLLER, UI_STATE_CONTROLLER } from './tokens';
import { ReactiveUIStateControllerType, UIStateControllerType } from './types';
import { ReactiveUIStateController } from './reactive-ui-state-controller';

/** @description Provides UI state controller instance */
export function provideUIStateControllers(
  controller?: (injector: Injector) => UIStateControllerType
) {
  const _controller = controller ?? ((i: Injector) => i.get(UIStateController));
  console.log('Registring UI state provider...', _controller);
  return {
    provide: UI_STATE_CONTROLLER,
    useFactory: () => {
      return _controller(inject(Injector));
    },
  } as Provider;
}

/** @description Provides an observable based UI state controller instance */
export function provideReactiveUIStateController(
  controller?: (injector: Injector) => ReactiveUIStateControllerType
) {
  const _controller =
    controller ?? ((i: Injector) => i.get(ReactiveUIStateController));
  return {
    provide: REACTIVE_UI_STATE_CONTROLLER,
    useFactory: () => {
      return _controller(inject(Injector));
    },
  } as Provider;
}
