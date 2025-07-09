import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { columns } from './helpers';
import { ColumnType } from './types';
import { GridDetailColumnType } from '@azlabsjs/ngx-clr-smart-grid';
import { DATA_PIPES } from '../pipes';
import { DetailColumnViewComponent } from './column-view.component';
import { PIPES_PROVIDERS } from './pipes.providers';
import { ResizeDirective } from './resize.directive';

@Component({
    imports: [
        CommonModule,
        DetailColumnViewComponent,
        ResizeDirective,
        ...COMMON_PIPES,
        ...DATA_PIPES,
    ],
    selector: 'ngx-data-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    providers: [...PIPES_PROVIDERS],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent {
  // #region Component inputs
  @Input({
    transform: (value: Record<string, unknown> | Record<string, unknown>[]) => {
      return Array.isArray(value) ? value : value ? [value] : [];
    },
  })
  data!: Record<string, undefined>[];
  @Input() layout: 'v' | 'vertical' | 'h' | 'horizontal' = 'vertical';
  @Input('before-detail') beforeDetailRef!: TemplateRef<unknown>;
  @Input('after-detail') afterDetailRef!: TemplateRef<unknown>;
  @Input({
    transform: (values: GridDetailColumnType[]) => columns(values ?? []),
  })
  columns!: ColumnType[];
  @Input() preview!: TemplateRef<any> | null;
  @Input() clickable: boolean = false;
  @Input() title!: string | null | undefined;
  // #endregion Component inputs

  // #region Component outputs
  @Output() pressed = new EventEmitter<any>();
  @Output() openPreview = new EventEmitter<string>();
  // #endregion Component outputs

  @HostListener('window.resize', ['$event']) resizeEevent() {
    this.cdRef?.markForCheck();
  }

  // Component constructor function
  constructor(@Optional() private cdRef?: ChangeDetectorRef | null) {}

  handlePressedEvent(e: Event, item: any) {
    e.preventDefault();
    if (!this.clickable) {
      return;
    }
    this.pressed.emit(item);
  }

  handlePreview(content: string) {
    this.openPreview.emit(content);
  }
}
