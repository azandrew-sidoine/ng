import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { GridDetailColumnType } from '@azlabsjs/ngx-clr-smart-grid';

/** @internal */
type ColumnType = Omit<GridDetailColumnType, 'style'> & {
  styles?: Record<string, boolean>;
  cssClass?: string;
};

/** @internal Create list of columns from the provides list of columns */
function columns(values: GridDetailColumnType[]) {
  return values.map((column) => ({
    title: column.title,
    titleTransform: column.titleTransform,
    property: column.property || '',
    style: column.style
      ? {
          cssClass: Array.isArray(column.style.cssClass)
            ? column.style.cssClass.join(' ')
            : column.style.cssClass ?? '',
          styles: Array.isArray(column.style.styles)
            ? column.style.styles.reduce((carry, curr) => {
                carry[curr] = true;
                return carry;
              }, {} as Record<string, boolean>)
            : column.style.styles ?? {},
        }
      : { cssClass: '', styles: '' },
    transform: column.transform ?? 'default',
  }));
}

@Component({
  standalone: true,
  imports: [CommonModule, ...COMMON_PIPES],
  selector: 'ngx-data-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
  // #region Component inputs
  private _data!: Record<string, any>[];
  @Input({ alias: 'data' }) set setData(
    value: Record<string, any> | Record<string, any>[]
  ) {
    this._data = Array.isArray(value) ? value : [value];
  }
  get data() {
    return this._data;
  }
  @Input() layout: 'v' | 'vertical' | 'h' | 'horizontal' = 'vertical';
  @Input({ alias: 'before-detail' }) beforeDetailRef!: TemplateRef<unknown>;
  @Input({ alias: 'after-detail' }) afterDetailRef!: TemplateRef<unknown>;
  private _columns!: ColumnType[];
  @Input() set columns(values: GridDetailColumnType[]) {
    this._columns = columns(values ?? []);
  }
  get columns() {
    return this._columns;
  }
  @Input() preview!: TemplateRef<any> | null;
  // #endregion Component inputs
}
