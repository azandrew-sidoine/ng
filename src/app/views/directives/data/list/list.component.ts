import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { UIActionEventArgType, ConfigType, UIActionConfigType } from '../core';
import { QueryStateType as QueryState } from '@azlabsjs/rx-query';
import { DATAGRID_DIRECTIVES } from '../../datagrid';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';

@Component({
    imports: [CommonModule, ...COMMON_PIPES, ...DATAGRID_DIRECTIVES, ...PIPES],
    selector: 'ngx-data-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  // #region Component Inputs
  @Input('refresh-css-class') refreshCssClass = 'btn-warning';
  @Input('refresh-text') refreshText: string = 'refresh';
  @Input('gridView') gridViewRef!: TemplateRef<unknown>;
  @Input('overflow') overflow!: TemplateRef<any>;
  @Input('action-bar') actionBar!: TemplateRef<any> | undefined;
  @Input('detail-pane') detailPaneRef!: TemplateRef<any> | undefined;
  @Input('show-detail-pane') showDetailPane: boolean = false;
  @Input('no-padding') noPadding: boolean = true;
  @Input('actions') set actions(values: UIActionConfigType[]) {
    const _actionBarActions: UIActionConfigType[] = [];
    const _overflowActions: UIActionConfigType[] = [];
    if (values) {
      for (const action of values) {
        if (action.position === 'overflow') {
          _overflowActions.push(action);
          continue;
        }
        if (action.position === 'action-bar') {
          _actionBarActions.push(action);
          continue;
        }
      }
    }
    this._actionBarActions = _actionBarActions;
    this._overflowActions = _overflowActions;
  }
  @Input() config!: ConfigType;
  @Input() url!: string;
  @Input('dg-state') dgState!: unknown;
  @Input('search-value') search!: string | null | undefined;
  // #endregion Component Inputs

  // #region Component outputs
  @Output('detail-change') detailPaneChange$ = new EventEmitter<unknown>();
  @Output('cached-query') cachedQuery = new EventEmitter<QueryState>();
  @Output('dg-state-change') dgStateChange = new EventEmitter<unknown>();
  @Output('refresh-grid') refreshGrid = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<UIActionEventArgType>();
  // #endregion Component outputs

  // #region Component properties
  _actionBarActions: UIActionConfigType[] = [];
  get actionBarActions() {
    return this._actionBarActions;
  }
  _overflowActions: UIActionConfigType[] = [];
  get overflowActions() {
    return this._overflowActions;
  }

  private _performingAction: boolean = false;
  get performingAction() {
    return this._performingAction;
  }
  // #endregion Component properties

  // Class constructor
  constructor(@Optional() private changes?: ChangeDetectorRef) {}

  handleDetailPaneChange(event: unknown) {
    this.detailPaneChange$.emit(event);
  }

  handleAction(event: Event, item: unknown, action: UIActionConfigType) {
    this.action.emit({ payload: item, action });
    event?.preventDefault();
    event?.stopPropagation();
  }

  handleActionBarAction(
    event: Event,
    values: unknown[],
    action: UIActionConfigType
  ) {
    this.action.emit({ payload: values, action });
    event?.preventDefault();
    event?.stopPropagation();
  }

  handleCachedQuery(query: QueryState) {
    this.cachedQuery.emit(query);
  }

  handleRefreshDatagrid(event: boolean) {
    this.refreshGrid.emit(event);
  }

  handleDgStateChanges(event: unknown) {
    this.dgStateChange.emit(event);
  }

  onDgItemClicked(
    event: unknown,
    handler?: (value: unknown) => void | Promise<void>
  ) {
    if (handler) {
      handler(event);
    }
  }

  onPerformingAction(value: boolean) {
    this._performingAction = value;
    this.changes?.markForCheck();
  }
}
