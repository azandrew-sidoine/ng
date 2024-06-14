import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveUIStateControllerType, UIStateControllerType } from './types';
import { UIStateController } from './ui-state-controller';
import { ReactiveUIStateController } from './reactive-ui-state-controller';
import {
  UIActionAlertComponent,
  UIActionIndicatorComponent,
} from './components';
import {
  provideReactiveUIStateController,
  provideUIStateControllers,
} from './providers';

type ConfigType = {
  provideStateController?: (injector: Injector) => UIStateControllerType;
  provideReactiveStateController?: (
    injector: Injector
  ) => ReactiveUIStateControllerType;
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
      ((injector: Injector) => injector.get(UIStateController));

    const _reactiveController =
      provideReactiveStateController ??
      ((injector: Injector) => injector.get(ReactiveUIStateController));

    return {
      ngModule: UIStateModule,
      providers: [
        provideUIStateControllers(_controller),
        provideReactiveUIStateController(_reactiveController),
      ],
    };
  }
}
