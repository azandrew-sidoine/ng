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
import { COMMON_PIPES, CommonTextPipe } from '@azlabsjs/ngx-common';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';
import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  UpperCasePipe,
} from '@angular/common';
import { DATA_PIPES } from '../pipes';
import { ProjectPaginateQueryOutputType } from '@azlabsjs/ngx-clr-smart-grid';

@Component({
    imports: [
        CommonModule,
        ...COMMON_PIPES,
        ...DATAGRID_DIRECTIVES,
        ...DATA_PIPES,
        ...PIPES,
    ],
    selector: 'ngx-data-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [
        UpperCasePipe,
        LowerCasePipe,
        CurrencyPipe,
        DecimalPipe,
        JsonPipe,
        PercentPipe,
        SlicePipe,
        AsyncPipe,
        CommonTextPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  // #region Component Inputs
  @Input({ alias: 'refresh-css-class' }) refreshCssClass = 'btn-warning';
  @Input({ alias: 'refresh-text' }) refreshText: string = 'refresh';
  @Input({ alias: 'gridView' }) gridViewRef!: TemplateRef<unknown>;
  @Input({ alias: 'overflow' }) overflow!: TemplateRef<any>;
  @Input({ alias: 'action-bar' }) actionBar!: TemplateRef<any> | undefined;
  @Input({ alias: 'detail-pane' }) detailPaneRef!: TemplateRef<any> | undefined;
  @Input({ alias: 'show-detail-pane' }) showDetailPane: boolean = false;
  @Input({ alias: 'no-padding' }) noPadding: boolean = true;
  @Input({ alias: 'actions' }) set actions(values: UIActionConfigType[]) {
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
  @Input({ alias: 'dg-state' }) dgState!: unknown;
  @Input({ alias: 'search-value' }) search!: string | null | undefined;
  @Input({ alias: 'except-columns' }) exceptColumns: string[] = [];
  @Input() filters: { property: string; value: unknown }[] = [];
  @Input() exporting: boolean = false;
  // #endregion Component Inputs

  // #region Component outputs
  @Output('detail-change') detailPaneChange = new EventEmitter<unknown>();
  @Output('cached-query') cachedQuery = new EventEmitter<QueryState>();
  @Output('dg-state-change') dgStateChange = new EventEmitter<unknown>();
  @Output('refresh-grid') refreshGrid = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<UIActionEventArgType>();
  @Output() queryChange = new EventEmitter<ProjectPaginateQueryOutputType>();
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
    this.detailPaneChange.emit(event);
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

  handleQueryChange(query: ProjectPaginateQueryOutputType) {
    this.queryChange.emit(query);
  }

  onPerformingAction(value: boolean) {
    this._performingAction = value;
    this.changes?.markForCheck();
  }
}
