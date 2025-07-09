import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Pipe,
  PipeTransform,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormsClient,
  FORM_CLIENT,
  ReactiveFormComponentInterface,
  FORM_DIRECTIVES,
} from '@azlabsjs/ngx-smart-form';
import {
  FormConfigInterface,
  InputConfigInterface,
} from '@azlabsjs/smart-form-core';
import { MODAL_DIRECTIVES, ModalElement, SizeType } from '../../modal';
import {
  Subscription,
  filter,
  firstValueFrom,
  of,
  take,
  tap,
  timer,
} from 'rxjs';
import { FORM_CONTROL_DIRECTIVES } from '@azlabsjs/ngx-clr-form-control';
import { CommonModule } from '@angular/common';
import { FormModalElement } from './types';
import {
  FormGroup,
  AsyncValidatorFn,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ControlsStateMap } from '@azlabsjs/ngx-smart-form/lib/angular/types';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';

// @Pipe({
//   name: 'typeOf',
//   standalone: true,
//   pure: true,
// })
// export class TypeOfPipe implements PipeTransform {
//   transform(value: any) {
//     console.log(value, Object.keys(value));
//     return typeof value;
//   }
// }

@Component({
    imports: [
        CommonModule,
        ...COMMON_PIPES,
        ...FORM_DIRECTIVES,
        ...FORM_CONTROL_DIRECTIVES,
        ...MODAL_DIRECTIVES,
        // TypeOfPipe
    ],
    selector: 'ngx-form-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent
  implements
    AfterViewInit,
    OnChanges,
    OnDestroy,
    FormModalElement,
    ReactiveFormComponentInterface
{
  // #region Component inputs
  @Input() title!: string | undefined | null;
  @Input() description!: string | undefined | null;
  @Input() opened: boolean = false;
  @Input() size: SizeType = 'lg';
  @Input() shrinkSize: 'sm' | 'lg' | 'xl' = 'lg';
  @Input() closeable: boolean = true;
  @Input() form!: FormConfigInterface | null;
  @Input() value!: unknown;
  @Input() disabled: boolean = false;
  @Input({ alias: 'no-grid-layout' }) noGridLayout: boolean = false;
  @Input({ alias: 'form-id' }) formId!: string | number;
  @Input({ alias: 'submit-text' }) submitText!: string;
  @Input({ alias: 'cancel-text' }) cancelText!: string;
  // #enregion Component inputs

  @ViewChild('modal', { static: false }) modalRef!: ModalElement | null;
  @ViewChild('formRef', { static: false })
  formRef!: ReactiveFormComponentInterface | null;

  // #region Component properties
  private _subscriptions: Subscription[] = [];
  get formGroup() {
    return this.formRef?.formGroup as FormGroup<any>;
  }
  // #endregion Component properties

  // #region Component output
  //
  @Output() viewInit = new EventEmitter<unknown>();
  @Output() changes = new EventEmitter<unknown>();
  @Output() submit = new EventEmitter<unknown>();
  @Output() ready = new EventEmitter<unknown>();
  @Output() error = new EventEmitter<unknown>();
  @Output() closed = new EventEmitter();
  // #endregion Component output

  // Class constructor
  constructor(
    @Inject(FORM_CLIENT) private client: FormsClient,
    private cdRef?: ChangeDetectorRef | null
  ) {}

  setValue(state: { [k: string]: unknown }): void {
    this.setFormValue(state);
  }

  addAsyncValidator(
    validator: AsyncValidatorFn,
    control?: string | undefined
  ): void {
    this.formRef?.addAsyncValidator(validator, control);
  }

  addValidator(validator: ValidatorFn, control?: string | undefined): void {
    this.formRef?.addValidator(validator, control);
  }

  getControlValue(control: string, _default?: any): unknown {
    return this.formRef?.getControlValue(control, _default);
  }

  setControlValue(control: string, value: any): void {
    this.formRef?.setControlValue(control, value);
  }

  disableControls(controls: ControlsStateMap): void {
    this.formRef?.disableControls(controls);
  }

  enableControls(controls: ControlsStateMap): void {
    this.formRef?.enableControls(controls);
  }

  addControl(name: string, control: AbstractControl<any, any>): void {
    this.formRef?.addControl(name, control);
  }

  setComponentForm(value: FormConfigInterface): void {
    this.formRef?.setComponentForm(value);
  }

  setControlConfig(
    config?: InputConfigInterface | undefined,
    name?: string | undefined
  ): void {
    this.formRef?.setControlConfig(config, name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('formId' in changes) {
      this.formEffect();
    }
  }

  async ngAfterViewInit() {
    this.formEffect();
    if (this.value) {
      await this.setFormValue(this.value);
    }
    await firstValueFrom(timer(1000).pipe(take(1)));
    this.viewInit.emit();
  }

  ngOnDestroy(): void {
    if (this.cdRef) {
      this.cdRef = null;
    }
    if (this._subscriptions) {
      for (const subscription of this._subscriptions) {
        subscription.unsubscribe();
      }
    }
  }

  validateForm(): void {
    this.formRef?.validateForm();
  }

  reset(): void {
    try {
      this.formRef?.reset();
    } catch (_) {}
  }

  close() {
    this.modalRef?.close();
  }

  open() {
    this.modalRef?.open();
  }

  onSubmit(event: unknown) {
    this.submit.emit(event);
  }

  onError(error: unknown) {
    this.error.emit(error);
  }

  onModalOpenedChanged(event: boolean) {
    if (true === event) {
      return;
    }
    this.closed.emit();
    this.reset();
  }

  onCancel(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.close();
    this.reset();
  }

  /**
   * Debugging method for registering to input value changes
   */
  controlValueChanges(name: string) {
    return this.formRef && this.formRef.getControl(name)
      ? this.formRef.controlValueChanges(name)
      : of();
  }

  getControl(name: string) {
    return this.formRef?.getControl(name);
  }

  onReady(event: unknown) {
    const timeout = setTimeout(() => {
      this.ready.emit(event);
      clearTimeout(timeout);
    }, 700);
  }

  toggleView(size: SizeType, event?: Event) {
    this.size = size === 'full' ? this.shrinkSize : 'full';
    this.cdRef?.markForCheck();
    event?.preventDefault();
  }

  private setState(form: FormConfigInterface) {
    this.form = form;
    this.cdRef?.detectChanges();
  }

  private async setFormValue<T = unknown>(value: T) {
    if (typeof value === 'object' && value !== null) {
      await firstValueFrom(
        timer(100).pipe(
          tap(() => this.formRef?.setValue(value as Record<string, unknown>))
        )
      );
    }
  }

  private formEffect() {
    if (this.formId) {
      const subscription = this.client
        .get(this.formId)
        .pipe(
          filter((form) => typeof form !== 'undefined' && form !== null),
          tap((form) => this.setState(form))
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }
}
