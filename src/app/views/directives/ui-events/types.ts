import { Observable } from 'rxjs';

export type UIEventState =
  | 'error'
  | 'success'
  | 'request-error'
  | 'bad-request'
  | 'exception'
  | 'none';

/** @internal */
export type UIEvent<T> = {
  performingAction: boolean;
  message?: string;
  error?: unknown;
  state?: T;
};

/** @internal */
export type StateChangesListener<T> = (state: UIEvent<T>) => void;


/** @internal */
export type Callback = (...args: any) => unknown;

/** @description Base UI state controller type declaration */
export type UIEventsControllerBase<T extends UIEventState = UIEventState> = {
  /**
   * Trigger the ui to an indicator of an ongoing action
   */
  startAction(): void;

  /**
   * Trigger the UI rederer to remove action indicator element
   */
  endAction(message?: string, state?: T): void;
};

/** @description  UI state controller type declaration */
export type UIEventsControllerType<T extends UIEventState = UIEventState> =
  UIEventsControllerBase<T> & {
    /**
     * Add a listener that is executed when the ui controller changes state.
     *
     * **Note** This helps making the component that uses the controller reactive to ui state changes
     */
    addListener(listener: StateChangesListener<T>): void;

    /**
     * Remove a listener from the list of listeners
     */
    removeListener(listener: StateChangesListener<T>): void;
  };

/** @description Reactive UI state controller that emit a stream of ui state changes */
export type ReactiveUIEventsControllerType<
  T extends UIEventState = UIEventState
> = UIEventsControllerBase<T> & {
  /**
   * UI state reactive property
   */
  uiState$: Observable<UIEvent<T>>;
};
