import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
    imports: [CommonModule],
    selector: 'ngx-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIAlertComponent {
  // #region Component inputs
  @Input() closable: boolean = true;
  @Input() light: boolean = false;
  @Input() cssClass!: string | string[] | Record<string, boolean>;
  @Input() type: 'warning' | 'success' | 'danger' | 'default' = 'default';
  // #endregion Component inputs

  // #region Component outputs
  @Output() close = new EventEmitter<unknown>();
  // #endregion Component outputs

  // Methods
  onClose(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.close.emit();
  }
}
