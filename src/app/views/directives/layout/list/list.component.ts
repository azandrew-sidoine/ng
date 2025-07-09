import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  selector: 'ngx-v-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VListComponent<T extends any = any> {
  // #region Component inputs
  @Input() items: T[] = [];
  @Input() minHeight: string | number = '200px';
  @Input() width: string | number = 'auto';
  @Input() height: string | number = 'auto';
  /** @description Size of item in in the list */
  @Input() itemSize: number = 50;
  @Input() template!: TemplateRef<any>;
  // #endregion Component inputs
}
