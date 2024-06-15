import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SearchInputComponent } from './search-input';
import { MODAL_DIRECTIVES, ModalElement } from '../modal';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { SafeHtmlPipe } from './pipes';

@Component({
  standalone: true,
  selector: 'ngx-search',
  imports: [
    CommonModule,
    SearchInputComponent,
    SafeHtmlPipe,
    ...MODAL_DIRECTIVES,
    ...COMMON_PIPES,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  //#region Component inputs
  @Input() title!: string;
  @Input() description!: string;
  //#endregion Component inputs

  // #region Component outputs
  @Output() valueChange = new EventEmitter<string>();
  // #endregion Component outputs

  @ViewChild('modal', { static: false }) modalRef!: ModalElement;
  @ViewChild('searchInput', { static: false })
  searchInput!: SearchInputComponent | null;
  @ViewChild('modalSearchInput', { static: false })
  modalSearchInput!: SearchInputComponent | null;

  handleSearchClick(e: Event) {
    this.modalRef.open();
    (this.searchInput?.input?.nativeElement as HTMLInputElement)?.blur();
    (this.modalSearchInput?.input?.nativeElement as HTMLInputElement)?.focus();

    e?.preventDefault();
  }

  handleSearchChange(e: string) {
    this.valueChange.emit(e);
  }
}
