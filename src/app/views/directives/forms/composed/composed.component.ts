import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { ComposedFormConfigType } from './types';
import {
  ComponentReactiveFormHelpers,
  FORM_DIRECTIVES,
  NgxSmartFormComponent,
  ReactiveFormComponentInterface,
} from '@azlabsjs/ngx-smart-form';
import { CLR_FORM_CONTROL_DIRECTIVES } from '@azlabsjs/ngx-clr-form-control';
import { firstValueFrom, tap, timer } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { NoDuplicate } from './decorators';
import { AsArrayPipe } from './pipes';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AsArrayPipe,
    ...COMMON_PIPES,
    ...FORM_DIRECTIVES,
    ...CLR_FORM_CONTROL_DIRECTIVES,
  ],
  selector: 'ngx-composed-form',
  templateUrl: './composed.component.html',
  styleUrls: ['./composed.component.scss'],
})
export class ComposedFormComponent implements OnDestroy {
  //#region Component inputs
  @Input() submitable: boolean = true;
  @Input({ alias: 'no-grid-layout' }) noGridLayout = false;
  @Input({ required: true }) @NoDuplicate() config!: ComposedFormConfigType;
  @Input() autoupload: boolean = true;
  //#endregion Component inputs

  //#region Component contents
  @ContentChildren(NgxSmartFormComponent) components!:
    | NgxSmartFormComponent[]
    | null;
  //#endregion Component contents

  //#region Component outputs
  @Output() error = new EventEmitter<unknown>();
  @Output() ready = new EventEmitter<unknown>();
  @Output() changes = new EventEmitter<unknown>();
  @Output() cancel = new EventEmitter<Event>();
  @Output() submit = new EventEmitter<unknown>();
  //#endregion Component outputs

  /** Holds a list of forms that are ready */
  private items: {
    name: string;
    element: ReactiveFormComponentInterface;
  }[] = [];
  private formgroup: FormGroup = new FormGroup({});

  handleSubmit(event: Event) {
    for (const f of this.items) {
      f.element?.onSubmit(event);
    }
    // Validate the form group
    ComponentReactiveFormHelpers.validateFormGroupFields(this.formgroup);

    // Case the form group is marked as valid, we dispatch the submit event
    if (this.formgroup.valid) {
      this.submit.emit(this.formgroup.getRawValue());
    }
  }

  async handleReady(
    name: string,
    event: unknown,
    form: ReactiveFormComponentInterface
  ) {
    await firstValueFrom(
      timer(500).pipe(
        tap(() => {
          if (!this.items.find((f) => f.name === name)) {
            this.items.push({ name, element: form });
          }
          if (this.areComponentFormsReady()) {
            // TODO: Pass the ready event value into ready emitted output
            for (const f of this.items) {
              let fg = this.formgroup.get(f.name);
              // We remove the abstract control if exists and make
              // it point to null for it to be garbage collected
              if (!!fg) {
                this.formgroup.removeControl(f.name);
                fg = null;
              }

              // Then we add the new formgroup to current component formgroup
              this.formgroup.addControl(f.name, f.element.formGroup);
            }
            this.ready.emit(this.formgroup);
          }
        })
      )
    );
  }

  // TODO: Provide changes handler implementation
  handleChanges(name: string, event: unknown) {}

  handleError() {
    this.error.emit(this.formgroup.errors);
  }

  handleCancel(e: Event) {
    this.cancel.emit(e);
  }

  ngOnDestroy(): void {
    this.items = [];
    this.formgroup.reset();
  }

  private areComponentFormsReady() {
    return this.config && this.config.flat().length <= this.items.length;
  }
}
