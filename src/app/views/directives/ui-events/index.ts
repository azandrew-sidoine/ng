import { UIActionAlertComponent } from './components';
import { UIActionIndicatorComponent } from './components/ui-action-indicator';
import { ReactiveUIEventsController } from './reactive-ui-events-controller';
import { UIEventsController } from './ui-events-controller';

export {
  ReactiveUIEventsControllerType as ReactiveUIStateControllerType,
  UIEventsControllerType as UIStateControllerType,
  UIEvent as UIState,
} from './types';
export {
  UI_EVENTS_CONTROLLER as UI_STATE_CONTROLLER,
  REACTIVE_UI_EVENTS_CONTROLLER as REACTIVE_UI_STATE_CONTROLLER,
} from './tokens';
export { UIStateModule } from './ui-event.module';
export {
  UIActionAlertComponent,
  UIActionIndicatorComponent,
} from './components';

// Export UI state controller providers
export {
  provideReactiveUIEventsController as provideReactiveUIStateController,
  provideUIEventsController as provideUIStateControllers,
} from './providers';

// Export UI state providers
export const UI_STATE_PROVIDERS = [
  ReactiveUIEventsController,
  UIEventsController,
] as const;

// Export UI State directives
export const UI_STATE_DIRECTIVES = [
  UIActionIndicatorComponent,
  UIActionAlertComponent,
] as const;
