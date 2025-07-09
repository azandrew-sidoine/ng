import { BehaviorSubject, Observable } from 'rxjs';
import { ReactiveUIEventsControllerType, UIEventState, UIEvent } from './types';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReactiveUIEventsController
  implements ReactiveUIEventsControllerType<UIEventState>
{
  // #region class properties
  private _uiState$ = new BehaviorSubject<UIEvent<UIEventState>>({
    performingAction: false,
  });
  public readonly uiState$: Observable<UIEvent<UIEventState>> =
    this._uiState$.asObservable();
  // #enregion class properties

  //
  startAction(): void {
    this._uiState$.next({
      performingAction: true,
      message: undefined,
      state: 'none',
    });
  }

  //
  endAction(message?: string, state?: UIEventState): void {
    this._uiState$.next({ performingAction: false, message, state });
  }
}
