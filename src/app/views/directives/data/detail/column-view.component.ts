import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { DATA_PIPES } from '../pipes';
import { PIPES_PROVIDERS } from './pipes.providers';

/** @internal */
type PipeTransformType = string | ((value: any) => any) | undefined;

@Component({
  standalone: true,
  imports: [CommonModule, ...COMMON_PIPES, ...DATA_PIPES],
  selector: 'ngx-data-detail-column',
  templateUrl: './column-view.component.html',
  styleUrls: ['./column-view.component.scss'],
  providers: [...PIPES_PROVIDERS],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailColumnViewComponent {
  //#region Component inputs
  @Input() type!: string;
  @Input() value!: unknown;
  @Input() transform!:
    | PipeTransformType
    | PipeTransformType[]
    | null
    | undefined;
  @Input() template!: TemplateRef<any> | null;
  //#endregion Component inputs

  //#region Component outputs
  @Output() preview = new EventEmitter<any>();
  //#endregion Component outputs

  handlePreview(e: Event, content: any) {
    this.preview.emit(content);
    e?.preventDefault();
  }
}
