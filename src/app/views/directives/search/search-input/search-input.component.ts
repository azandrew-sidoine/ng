import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

/** @internal */
type StateType = {
  value: string;
  disabled: boolean;
};

@Component({
  standalone: true,
  selector: 'ngx-search-input',
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  //#region Component inputs
  @Input() value: string = '';
  @Input() placeholder: string = 'Search...';
  @Input() bordered: boolean = false;
  //#endregion Component inputs

  // #region Component outputs
  @Output() click = new EventEmitter<Event>();
  @Output() valueChange = new EventEmitter<string>();
  // #endregion Component outputs

  @ViewChild('input', { static: false, read: ElementRef })
  input!: ElementRef | null;

  // #region Component properties
  private _state: StateType = {
    value: '',
    disabled: false,
  };

  get state() {
    return this._state;
  }
  // #endregion Component properties

  /** @description SearchInputComponent class constructor */
  constructor(private cdRef: ChangeDetectorRef | null) {}

  handleClickEvent(e: Event) {
    this.click.emit(e);
    e?.preventDefault();
  }

  handleChangeEvent(e: Event) {
    const { value: v } = this._state;
    const value = (e?.target as HTMLInputElement).value.trim();
    // Case the value does not change we doe not fire any change event
    if (v === value) {
      return;
    }
    this.setState((state) => ({ ...state, value }));
    this.dispatchValueChange();
    e?.preventDefault();
    e?.stopPropagation();
  }

  private dispatchValueChange() {
    const { value } = this._state;
    this.valueChange.emit(value);
  }

  /** @description update component state and notify ui of state changes */
  private setState(state: (s: StateType) => StateType) {
    this._state = state(this._state);
    this.cdRef?.markForCheck();
  }
}
