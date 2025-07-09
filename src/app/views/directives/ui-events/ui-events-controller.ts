import { Injectable, OnDestroy } from '@angular/core';
import {
  StateChangesListener,
  UIEventState,
  UIEvent,
  UIEventsControllerType,
} from './types';

@Injectable({
  providedIn: 'root'
})
export class UIEventsController
  implements UIEventsControllerType<UIEventState>, OnDestroy
{
  private _uiState: UIEvent<UIEventState> = {
    performingAction: false,
  };
  private _listeners: StateChangesListener<UIEventState>[] = [];
  get uiState() {
    return this._uiState;
  }

  private setState(
    value:
      | Partial<UIEvent<UIEventState>>
      | ((state: UIEvent<UIEventState>) => UIEvent<UIEventState>)
  ) {
    const _setState =
      typeof value === 'function' && value !== null
        ? value
        : (state: UIEvent<UIEventState>) => ({ ...state, ...value });

    // Update the UI state object
    this._uiState = _setState(this._uiState);

    // Notify all listeners
    for (const listener of this._listeners) {
      if (listener) {
        listener(this._uiState);
      }
    }
  }

  addListener(listener: StateChangesListener<UIEventState>): void {
    this._listeners.push(listener);
  }

  removeListener(listener: StateChangesListener<UIEventState>): void {
    const _index = this._listeners.findIndex(
      (_listener) => _listener === listener
    );
    if (_index !== -1) {
      this._listeners.splice(_index, 1);
    }
  }

  //
  startAction(): void {
    this.setState({ performingAction: true });
  }

  //
  endAction(message?: string, state?: UIEventState): void {
    this.setState({ performingAction: false, message, state });
  }

  ngOnDestroy(): void {
    for (const listener of this._listeners) {
      this.removeListener(listener);
    }
  }
}
