import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { UI_STATE_CONTROLLER } from '../../tokens';
import { UIActionState, UIState, UIStateControllerType } from '../../types';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UIAlertComponent } from '../ui-alert';
import { AlertTypePipe } from './pipes';

@Component({
  standalone: true,
  imports: [CommonModule, UIAlertComponent, AlertTypePipe],
  selector: 'ngx-action-alert',
  templateUrl: './ui-action-alert.component.html',
  styleUrls: ['./ui-action-alert.component.scss'],
  animations: [
    trigger('fadeInOutSlide', [
      transition(':enter', [
        style({ transform: 'translateX(250px)', opacity: 0 }),
        animate(
          '200ms ease-in',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateX(250px)', opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIActionAlertComponent implements OnDestroy {
  @HostBinding('class.action-alert-container') actionAlertContainer = true;
  //#region Component input properties
  @Input() closable: boolean = true;
  @Input() light: boolean = false;
  @Input({alias: 'app-level'}) appLevel = true;
  //#endregion Component input properties

  // #region Component properties
  private _destroyTimer$ = new Subject<void>();
  // #endregion Component properties

  _state = {
    performingAction: false as boolean,
    message: undefined as string | undefined,
    cssClass: {} as Record<string, boolean>,
    status: undefined as undefined | UIActionState,
  };

  get state() {
    return this._state;
  }

  constructor(
    @Inject(UI_STATE_CONTROLLER)
    public readonly controller: UIStateControllerType,
    @Optional() private cdRef?: ChangeDetectorRef
  ) {
    this.controller.addListener(this.setState.bind(this));
  }

  /** @description Set ui state property value */
  setState(state: UIState<UIActionState>) {
    // Case the state changes, we stop the timer that closes the alert component
    this._destroyTimer$.next();
    this._state = {
      message: state.message,
      status: state.state,
      cssClass: {
        light: this.light,
        ['app-level']: Boolean(this.appLevel),
      },
      performingAction: state.performingAction,
    };

    // We only create the close timer if the alert component is to be shown
    if (
      !this.state.performingAction &&
      !!state.message &&
      !!this.state.status &&
      this.state.status !== 'none'
    ) {
      timer(5000)
        .pipe(takeUntil(this._destroyTimer$))
        .subscribe(() => this.onCloseAlert());
    }

    this.cdRef?.markForCheck();
  }

  onCloseAlert(event?: Event) {
    this.controller.endAction();
    event?.preventDefault();
    event?.stopPropagation();
  }

  ngOnDestroy(): void {
    this.controller.removeListener(this.setState.bind(this));
  }
}
