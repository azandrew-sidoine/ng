import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-ui-alert',
  templateUrl: 'ui-alert.component.html',
  styleUrls: ['./ui-alert.component.scss'],
})
export class UIAlertComponent {
  // #region Component inputs
  @Input() closable: boolean = true;
  @Input() light: boolean = false;
  @Input() cssClass!: string | string[]| Record<string, boolean>;
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
