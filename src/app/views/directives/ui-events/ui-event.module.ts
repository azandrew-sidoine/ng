import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveUIEventsControllerType, UIEventsControllerType } from './types';
import { UIEventsController } from './ui-events-controller';
import { ReactiveUIEventsController } from './reactive-ui-events-controller';
import {
  UIActionAlertComponent,
  UIActionIndicatorComponent,
} from './components';
import {
  provideReactiveUIEventsController,
  provideUIEventsController,
} from './providers';

type ConfigType = {
  provideStateController?: (injector: Injector) => UIEventsControllerType;
  provideReactiveStateController?: (
    injector: Injector
  ) => ReactiveUIEventsControllerType;
};

@NgModule({
  imports: [UIActionIndicatorComponent, UIActionAlertComponent],
  exports: [UIActionIndicatorComponent, UIActionAlertComponent],
})
export class UIStateModule {
  static forRoot(config?: ConfigType): ModuleWithProviders<UIStateModule> {
    const { provideReactiveStateController, provideStateController } =
      config ?? {};
    const _controller =
      provideStateController ??
      ((injector: Injector) => injector.get(UIEventsController));

    const _reactiveController =
      provideReactiveStateController ??
      ((injector: Injector) => injector.get(ReactiveUIEventsController));

    return {
      ngModule: UIStateModule,
      providers: [
        provideUIEventsController(_controller),
        provideReactiveUIEventsController(_reactiveController),
      ],
    };
  }
}
