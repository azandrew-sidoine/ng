import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ResolveStart,
  ResolveEnd,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterEventsListener implements OnDestroy {
  // #region Class properties
  _state$ = new BehaviorSubject<{ navigating: boolean; resolving: boolean }>({
    navigating: true,
    resolving: false,
  });
  state$ = this._state$.asObservable();
  private _subscriptions: Subscription[] = [];
  // #endregion Class properties

  // Class constructor
  constructor(router: Router) {
    // Listen for router event to show a loader when application is still navigating...
    const subscription = router.events.subscribe((event) => {
      this.handleRouterEvent(event);
    });
    this._subscriptions.push(subscription);
  }

  handleRouterEvent(event: Event) {
    if (event instanceof ResolveStart) {
      this._state$.next({ ...this._state$.getValue(), resolving: true });
    }
    if (event instanceof ResolveEnd) {
      this._state$.next({ ...this._state$.getValue(), resolving: false });
    }
    if (event instanceof NavigationStart) {
      this._state$.next({ ...this._state$.getValue(), navigating: true });
    }
    if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this._state$.next({ ...this._state$.getValue(), navigating: false });
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this._subscriptions ?? []) {
      subscription.unsubscribe();
    }
  }
}
