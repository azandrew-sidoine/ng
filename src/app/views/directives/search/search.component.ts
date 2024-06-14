import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngx-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  // #region Component outputs
  @Output() click = new EventEmitter<void>();
  @Output() change = new EventEmitter<string>();
  // #endregion Component outputs

  handleClickEvent(e: Event) {
    this.click.emit();
    e?.preventDefault();
  }

  handleChangeEvent(e: Event) {
    // TODO: Handle input value changes event
    this.change.emit();
  }
}
