import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { SizeType } from './types';

/** @internal */
type StateType = {
  opened: boolean;
  size: SizeType;
};

@Component({
    imports: [CommonModule],
    selector: 'ngx-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    animations: [
        trigger('fadeInOutSlideBottom', [
            transition('close => open', [
                style({ transform: 'translateY(1000px)', opacity: 0 }),
                animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 })),
            ]),
            transition('open => close', [
                style({ transform: 'translateY(0)', opacity: 1 }),
                animate('200ms ease', style({ transform: 'translateY(1000px)', opacity: 0 })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxModalComponent implements AfterViewInit, OnChanges {
  // #region Component internal properties
  private _state: StateType = {
    opened: false,
    size: 'lg',
  };
  get state() {
    return this._state;
  }
  // #region Component internal properties
  // #region Component inputs
  @Input() opened: boolean = false;
  @Input() size: SizeType = 'lg';
  @Input() closeable: boolean = false;
  // #endregion Component inputs

  // #region Component output
  @Output() openedChange = new EventEmitter<boolean>();
  // #region Component output

  // #region Content children
  @ContentChild('template') templateRef!: TemplateRef<unknown>;
  // #endregion Content children

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeyPress(event: KeyboardEvent) {
    if (this._state.opened) {
      this.close();
      event?.stopPropagation();
    }
  }

  // Class constructor
  constructor(private _ref?: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const state = (Object.keys(this._state) as (keyof StateType)[]).reduce(
      (carry, curr: keyof StateType) => {
        if (curr in changes) {
          carry[curr] = changes[curr].currentValue;
        }
        return carry;
      },
      {} as Partial<StateType>
    );

    // Update the state on changes
    this.setState(state);
  }

  ngAfterViewInit(): void {
    this.setState((state) => ({
      ...state,
      opened: this.opened,
      size: this.size,
    }));
  }

  /**
   * Control or change component local state object
   */
  private setState(
    _partial: Partial<StateType> | ((_state: StateType) => StateType)
  ) {
    if (typeof _partial === 'function' && _partial !== null) {
      this._state = _partial({ ...this.state });
    } else {
      this._state = { ...this.state, ..._partial };
    }
    this._ref?.markForCheck();
  }

  close() {
    this.onClose();
  }

  open() {
    this.setState({ opened: true });
  }

  onClose(event?: Event) {
    this.setState({ opened: false });
    this.openedChange.emit(false);
    event?.preventDefault();
    event?.stopPropagation();
  }
}
