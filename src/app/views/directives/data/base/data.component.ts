import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ActionConfigType,
  ActionHandlerType,
  ActionType,
  AssetFormConfigType,
  ConfigType,
  CustomActionConfigType,
  DataComponentType,
  EntityBaseType,
  JsFormConfigType,
  StateType,
  UIActionConfigType,
  UIActionEventArgType,
  ViewStateType,
  ObservableFormBuilder,
  remove,
} from '../core';
import {
  CreateQueryActionHandler,
  DeleteQueryActionHandler,
  UpdateQueryActionHandler,
} from './handlers';

import {
  FormsClient,
  FORM_CLIENT,
  ReactiveFormComponentInterface,
} from '@azlabsjs/ngx-smart-form';
import {
  Subject,
  Subscription,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  of,
  tap,
} from 'rxjs';

import {
  trigger,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { DIALOG, Dialog } from '../../dialog';
import { QueryStateType as QueryState } from '@azlabsjs/rx-query';
import {
  CustomActionHTTPHandler,
  DataComponentService,
} from './data.component.service';
import { defaultActions, defaultDgState } from './defaults';
import {
  createActionConfigType,
  createFormConfig,
  mapIntoAsync,
  refreshCachedQueries,
  updateCachedQueries,
} from './helpers';
import { DataGridStateType, DATAGRID_CONFIG } from '../../datagrid';
import { SizeType } from '../../modal';
import { FormConfigInterface } from '@azlabsjs/smart-form-core';
import {
  CREATE_ACTION_HANDLER,
  DELETE_ACTION_HANDLER,
  REQUEST_CLIENT,
  UPDATE_ACTION_HANDLER,
} from './tokens';
import { NgHttpRequestClient } from './http-client';
import { CommonModule } from '@angular/common';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { FORM_MODAL_DIRECTIVES } from '../../forms';
import { LIST_DIRECTIVES } from '../list';
import { DETAIL_DIRECTIVES } from '../detail';
import { FORM_DIRECTIVES } from '../form';
import { DATA_PIPES } from '../pipes';
import { PIPES } from './pipes';
import { ProjectPaginateQueryOutputType } from '@azlabsjs/ngx-clr-smart-grid';
import { DIRECTIVES as SIDEPANE_DIRECTIVES } from '../../sidepane';

/** @internal */
type ActionErrorArgType = { type: string; err: unknown };

/** @internal */
type ActionArgResultType = { type: string; payload: unknown };

/** @internal */
type ExceptionsType = string[] | null;

/** @internal */
type ReadyOutputRefType = EntityBaseType | undefined | null;

@Component({
  imports: [
    CommonModule,
    ...COMMON_PIPES,
    ...FORM_MODAL_DIRECTIVES,
    ...LIST_DIRECTIVES,
    ...DETAIL_DIRECTIVES,
    ...FORM_DIRECTIVES,
    ...DATA_PIPES,
    ...PIPES,
    ...SIDEPANE_DIRECTIVES,
  ],
  selector: 'ngx-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [
    DeleteQueryActionHandler,
    CreateQueryActionHandler,
    UpdateQueryActionHandler,
    DataComponentService,
    CustomActionHTTPHandler,
    { provide: REQUEST_CLIENT, useClass: NgHttpRequestClient },
    { provide: DELETE_ACTION_HANDLER, useClass: DeleteQueryActionHandler },
    { provide: UPDATE_ACTION_HANDLER, useClass: UpdateQueryActionHandler },
    { provide: CREATE_ACTION_HANDLER, useClass: CreateQueryActionHandler },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms 50ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DataComponent
  implements OnDestroy, DataComponentType, OnChanges, AfterViewInit
{
  // #region component inputs
  private _config!: ConfigType;
  get config() {
    return this._config;
  }
  @Input() set config(value: ConfigType) {
    this._config = value;
    if (value && value.actions) {
      this._uiActions = createActionConfigType(value.actions);
    }
  }
  @Input() url!: string;
  @Input() layout: 'pane' | 'modal' = 'pane';
  /** @deprecated */
  @Input() noModal: boolean = false;
  @Input({ alias: 'modal-size' }) modalSize: SizeType = 'full';
  @Input() title!: string;
  @Input() description!: string;
  @Input('form-title') formTitle!: string;
  @Input() searchable: boolean = true;
  @Input() actions: ActionType[] = defaultActions;
  @Input({ alias: 'no-padding' }) noPadding: boolean = true;

  // customization
  @Input({ alias: 'refresh-text' }) refreshText: string = 'actions.refresh';
  @Input({ alias: 'submit-text' }) submitText: string = 'actions.submit';
  @Input({ alias: 'cancel-text' }) cancelText: string = 'actions.back';
  @Input({ alias: 'request-error-text' }) requestErrorText: string =
    'Request error!';
  @Input({ alias: 'request-complete-text' }) requestCompleteText: string =
    'Request completed successfully!';
  @Input({ alias: 'update-complete-text' }) updateCompleteText!: string;
  @Input({ alias: 'create-complete-text' }) createCompleteText!: string;
  @Input({ alias: 'delete-complete-text' }) deleteCompleteText!: string;
  @Input({ alias: 'delete-prompt' }) deletePrompt!: string;
  @Input({ alias: 'has-detail' }) hasDetail = false;
  @Input() detailPane!: TemplateRef<any> | undefined;
  @Input({ alias: 'except-grid-columns' }) gridColumnsExptions: ExceptionsType =
    [];
  @Input({ alias: 'except-detail-columns' })
  detailColumnsExptions: ExceptionsType = [];
  @Input() selected!: EntityBaseType | null | undefined | number | string;

  @Input() set view(value: ViewStateType) {
    this.setView(value);
  }
  @Input() set query(value: Record<string, unknown>) {
    const filters: { property: string; value: unknown }[] = [];
    for (const property in value) {
      filters.push({ property, value: value[property] });
    }
    this.setState((s) => ({ ...s, filters }));
  }
  // #endregion

  // #region component children
  @ContentChild('header') headerRef!: TemplateRef<unknown>;
  @ContentChild('listView') listRef!: TemplateRef<unknown>;
  @ContentChild('gridView') gridRef!: TemplateRef<unknown>;
  @ContentChild('overflow') overflowRef!: TemplateRef<any>;
  @ContentChild('actionBar') actionBarRef!: TemplateRef<any>;
  @ContentChild('beforeDetail') beforeDetailRef!: TemplateRef<unknown>;
  @ContentChild('afterDetail') afterDetailRef!: TemplateRef<unknown>;
  // #endregion component children

  // #region component outputs
  @Output('action-error') actionError = new EventEmitter<ActionErrorArgType>();
  @Output('action-result') actionResult =
    new EventEmitter<ActionArgResultType>();
  @Output('performing-action') performingAction = new EventEmitter<boolean>();
  @Output('detail-change') detailPaneChange$ = new EventEmitter<unknown>();
  @Output('form-error') error = new EventEmitter<unknown>();
  @Output('form-ready') ready = new EventEmitter<ReadyOutputRefType>();
  @Output('form-changes') changes = new EventEmitter<unknown>();
  @Output('form-closed') closed = new EventEmitter<unknown>();
  @Output() stateChange = new EventEmitter<StateType>();
  // #endregion

  // #region component properties
  private _state!: StateType;
  get state() {
    return this._state;
  }
  private _uiActions: UIActionConfigType[] = [];
  get uiActions() {
    return this._uiActions;
  }
  private subscriptions: Subscription[] = [];
  _searchSubject$ = new Subject<string>();
  search$ = this._searchSubject$.asObservable().pipe(distinctUntilChanged());
  // #endregion

  // #region component children
  @ViewChild('formRef', { static: false })
  form!: ReactiveFormComponentInterface | null;
  @ViewChild('componentOutlet', { read: ViewContainerRef, static: false })
  componentOutlet!: ViewContainerRef;
  // #endregion

  constructor(
    private service: DataComponentService,
    private customAction: CustomActionHTTPHandler,
    @Inject(FORM_CLIENT) private client: FormsClient,
    @Inject(DIALOG) private dialog: Dialog,
    @Optional() public readonly injector: Injector | null,
    @Inject(DATAGRID_CONFIG) @Optional() gridConfig?: DataGridStateType,
    @Optional() private cdRef?: ChangeDetectorRef | null
  ) {
    this._state = {
      view: 'listView',
      cachedQueries: [],
      dgState: {
        ...defaultDgState,
        page: {
          size: gridConfig?.pageSize ?? defaultDgState.page.size ?? 20,
          current: 1,
        },
      },
      query: null,
    };
  }

  ngAfterViewInit(): void {
    if (this._config && !this._state?.formBuilder) {
      this._state = {
        ...this._state,
        formBuilder: this.createBuilder(this._config),
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { view } = changes;
    if (
      view &&
      this._config &&
      (view.currentValue === 'create' || view.currentValue === 'createView')
    ) {
      let builder = this._config ? this.createBuilder(this._config) : null;
      this.handleCreate(this._config, builder);
    }

    if (
      view &&
      this.selected &&
      this._config &&
      (view.currentValue === 'editView' || view.currentValue === 'edit')
    ) {
      let builder = this._config ? this.createBuilder(this._config) : null;
      const _selected =
        typeof this.selected === 'object'
          ? (this.selected as EntityBaseType)
          : ({ id: this.selected } as EntityBaseType);

      this.handleUpdate(_selected, this._config, builder);
    }
  }

  detailPaneChange(event: unknown) {
    this.detailPaneChange$.emit(event);
  }

  /** @description Handle resources update events */
  async handleUpdate(
    event: unknown,
    config: ConfigType<'update'>,
    builder?: ObservableFormBuilder<FormConfigInterface> | null
  ) {
    const _event = event as EntityBaseType;
    if (typeof _event.id === 'undefined' || _event.id === null) {
      throw new Error('UI resource `id` property cannot be null');
    }

    const { update } = config.actions ?? {};
    const { excludedInputs: _excluded, notRequiredInput: _required } =
      update ?? {};
    const updateConfig = update as ActionConfigType | undefined;

    // #region Transform selected value
    // Trigger an action start flow
    this.onStartAction();
    const _selected = await mapIntoAsync(
      event,
      updateConfig?.before ?? ((_value) => _value)
    );
    this.onEndAction();
    // #region Tranform select value

    this.setState((state) => {
      const b = builder ?? state.formBuilder;
      return {
        ...state,
        previousView: state.view,
        view: 'editView',
        formBuilder: b,
        form: b
          ? b.pipe(map((fn) => fn(_excluded ?? [], _required ?? [])))
          : state.form,
        selected: _selected as EntityBaseType,
      };
    });
  }

  async handleDelete(event: unknown, config: ConfigType) {
    let result = true;
    if (this.deletePrompt) {
      result = await this.dialog.confirm(this.deletePrompt);
    }
    // Case user did not confirm the delete action we drop from the execution context
    if (!result) {
      return;
    }
    const _event = event as { id: string | number };
    const { id } = _event;
    await this.delete({ id, config, event });
  }

  /**
   * Whenever user interact with the `new` button, this handler changes
   * the view state to a `create view` state
   */
  handleCreate(
    config: ConfigType,
    builder?: ObservableFormBuilder<FormConfigInterface> | null
  ) {
    let { create } = config.actions ?? {};
    const { excludedInputs: excluded, notRequiredInput: notRequired } =
      create ?? {};
    this.setState((state) => {
      const b = builder ?? state.formBuilder;
      return {
        ...state,
        view: 'createView',
        previousView: state.view,
        formBuilder: b,
        form: b
          ? b.pipe(map((fn) => fn(excluded ?? [], notRequired ?? [])))
          : state.form,
      };
    });
  }

  /** @description Handle form ui cancel event */
  handleCancel(event?: Event) {
    this.setState((state) => ({
      ...state,
      previousView: undefined,
      view: state.previousView ?? 'listView',
      selected: undefined,
      form: undefined,
    }));

    event?.preventDefault();
    event?.stopPropagation();
    this.closed.emit();
  }

  handleSidepaneOpenedChange(e: boolean, cancel: (e?: Event) => void) {
    if (e === false) {
      cancel();
    }
  }

  /**
   * Handles form submission event
   */
  async handleSubmit(event: unknown, config: ConfigType, state: StateType) {
    const { view } = state;

    // Handle an update event case element is selected
    // and viewState is an xreateView state
    if (view === 'createView') {
      return this.create({ event, config });
    }

    // Handle an update event case element is selected
    // and viewState is an editView state
    if (view === 'editView' && state.selected) {
      // Trigger an action start flow
      const { id } = state.selected;
      if (typeof id === 'undefined' || id === null) {
        throw new Error('UI resource `id` property cannot be null');
      }
      return await this.update({ event, id, config });
    }
    throw new Error(`Invalid view state: ${view}`);
  }

  /**
   * Handle UI create action
   */
  async create(payload: { event: unknown; config: ConfigType }) {
    const { event, config } = payload;
    let { create } = config.actions ?? {};
    const createConfig = create as ActionConfigType | undefined;
    const _url =
      config.form?.url ?? createConfig?.url ?? config.url ?? this.url;
    if (typeof _url === 'undefined' || _url === null) {
      throw new Error(
        'Submission url cannot be null, please configure url for update or '
      );
    }

    // Trigger an action start flow
    this.onStartAction();
    return await lastValueFrom(
      this.service
        .create(_url, event, createConfig, (err) => {
          this.onActionError({
            type: 'create',
            err,
            message: this.requestErrorText ?? 'Request Error!',
          });
        })
        .pipe(
          tap((payload) => {
            this.onActionResult({
              type: 'create',
              payload,
              message:
                this.createCompleteText ??
                this.requestCompleteText ??
                'Request completed successfully!',
            });
            this.form?.reset();
          })
        )
    );
  }

  /**
   * Handle update action using UI configuration
   */
  async update(payload: {
    event: unknown;
    config: ConfigType;
    id: string | number;
  }): Promise<unknown> {
    const { event, config, id } = payload;
    const { update } = config.actions ?? {};
    const updateConfig = update as ActionConfigType | undefined;
    const _url =
      config.form?.url ?? updateConfig?.url ?? config.url ?? this.url;
    if (typeof _url === 'undefined' || _url === null) {
      throw new Error(
        'Submission url cannot be null, please configure url for update or '
      );
    }
    this.onStartAction();
    return await lastValueFrom(
      this.service
        .update(_url, id, event, updateConfig, (err) => {
          this.onActionError({
            type: 'update',
            err,
            message: this.requestErrorText ?? 'Request Error!',
          });
        })
        .pipe(
          tap((payload) =>
            this.onActionResult({
              type: 'update',
              payload,
              message:
                this.updateCompleteText ??
                this.requestCompleteText ??
                'Request completed successfully!',
            })
          )
        )
    );
  }

  /**
   * Handles /DELETE calls on the component instances
   */
  delete(payload: {
    id: string | number;
    config: ConfigType;
    event?: unknown;
  }) {
    const { id, config, event } = payload;
    if (typeof id === 'undefined' || id === null) {
      throw new Error('UI resource `id` property cannot be null');
    }

    let { delete: _delete } = config.actions ?? {};

    const deleteConfig = _delete as ActionConfigType | undefined;
    const _url = deleteConfig?.url ?? config.url ?? this.url;

    if (typeof _url === 'undefined' || _url === null) {
      throw new Error(
        'Submission url cannot be null, please configure url for update or '
      );
    }
    // Trigger an action start flow
    this.onStartAction();
    return lastValueFrom(
      this.service
        .delete(_url, id, event, deleteConfig, (err) => {
          this.onActionError({
            type: 'delete',
            err,
            message: this.requestErrorText ?? 'Request Error!',
          });
        })
        .pipe(
          tap((payload) =>
            this.onActionResult({
              type: 'delete',
              payload,
              message:
                this.deleteCompleteText ??
                this.requestCompleteText ??
                'Request completed successfully!',
            })
          )
        )
    );
  }

  setView(view: ViewStateType): void {
    if (
      view !== 'createView' &&
      view !== 'editView' &&
      (this.state.view === 'gridView' || this.state.view === 'listView')
    ) {
      return;
    }

    this.setState({ view });
  }

  /** @description Handles datagrid cached queries event */
  onCachedQuery(query: QueryState) {
    // Cached queries is implemented as a LIFO data structure
    // because latest cached queries are to be refeteched an old queries are to be invalidated
    this.setState((state) => {
      return {
        ...state,
        cachedQueries: updateCachedQueries(state.cachedQueries ?? [], query),
      };
    });
  }

  /** @description Provides a handler implementation for datagrid state changes events */
  onDgStateChanges(event: unknown) {
    this.setState({ dgState: event });
  }

  handleQueryChange(query: ProjectPaginateQueryOutputType) {
    this.setState((s) => ({ ...s, query }));
  }

  /** @description Provides a handler implementation for datagrid refresh events */
  onRefreshDatagrid(event: boolean) {
    if (event) {
      refreshCachedQueries(this._state.cachedQueries, (queries) => {
        this.setState({ cachedQueries: queries });
      });
    }
  }

  /** @description Handles actions coming from user interaction with the UI */
  handleAction(event: UIActionEventArgType, config: ConfigType) {
    const { payload, action } = event;
    const { name } = action as { name: ActionType };
    const { actions: _actions } = config;
    // Construct default handlers for create, update and delete actions
    // Case developper provides an action handler for basic crud actions
    // those handlers overrides the default
    const _handlers: Partial<{
      [prop in ActionType]: () => unknown;
    }> = {
      create: () =>
        _actions &&
        'create' in _actions &&
        _actions['create'] &&
        typeof (_actions['create'] as ActionHandlerType).handle === 'function'
          ? this.callCustomAction.call(
              this,
              _actions['create'],
              name,
              payload,
              config
            )
          : this.handleCreate.call(this, config),
      export: () =>
        _actions &&
        'export' in _actions &&
        _actions['export'] &&
        typeof (_actions['export'] as ActionHandlerType).handle === 'function'
          ? this.callCustomAction.call(
              this,
              _actions['export'],
              name,
              payload,
              config
            )
          : this.handleExport.call(this, config),
      update: () =>
        _actions &&
        'update' in _actions &&
        _actions['update'] &&
        typeof (_actions['update'] as ActionHandlerType).handle === 'function'
          ? this.callCustomAction.call(
              this,
              _actions['update'],
              name,
              payload,
              config
            )
          : this.handleUpdate.call(this, payload, config),
      delete: () =>
        _actions &&
        'delete' in _actions &&
        _actions['delete'] &&
        typeof (_actions['delete'] as ActionHandlerType).handle === 'function'
          ? this.callCustomAction.call(
              this,
              _actions['delete'],
              name,
              payload,
              config
            )
          : this.handleDelete.call(this, payload, config),
    };

    // Create a handler to which the call fallback to case it's not a default handler
    const _fallback = () => {
      if (!_actions) {
        return;
      }
      const _action = _actions[name];

      // Call the custom action with the name, payload and configuration
      this.callCustomAction.call(this, _action, name, payload, config);
    };

    // Case the handler is defined in the default handler, we invoke the handler
    const _handler = _handlers[name as ActionType];
    if (_handler) {
      return _handler();
    }

    // Call the fallback handler case action is not a default action
    return _fallback();
  }

  /** @description Handles search component events */
  handleSearch(event: Event) {
    this._searchSubject$.next((event.target as HTMLInputElement).value);
  }

  // #region Form component events
  handleFormChanges(event: unknown) {
    const { form } = this.config ?? {};
    if (form?.changes) {
      form.changes(event);
      return;
    }
    // Emit changes event even if handler is provided
    this.changes.emit(event);
  }

  handleFormError(error: unknown) {
    const { form } = this.config ?? {};
    if (form?.error) {
      form.error(error);
    }
    this.error.emit(error);
  }

  handleFormReady(_: unknown) {
    const { form } = this.config ?? {};
    if (form?.ready) {
      form.ready(this.form, this.injector ?? null, this.state.selected);
    }
    // Emit the ready event even if handler is provided
    this.ready.emit(this.state.selected);
  }
  // #endregion Form component event

  // Export handler function
  handleExport(config: ConfigType) {
    const query = remove(
      remove(this.state.query ?? ({} as Record<string, unknown>), 'per_page'),
      'page'
    );
    let { url, actions } = config;
    if (!url && actions) {
      url = (actions['export'] as ActionConfigType).url;
    }
    url = url ?? this.url;
    let { headers } = config.datagrid?.export ?? {};
    if (!headers && Array.isArray(config.datagrid?.columns)) {
      const gridColumns = config.datagrid?.columns;
      headers = gridColumns.map((c) => ({
        name: c.title,
        property: (c as any).label ?? (c as any).property,
      }));
    }
    if (url && headers) {
      this.service?.export(url, headers, query, config.listBuilder);
    }
  }

  // Call custom action provided by the component user
  private callCustomAction(
    _action: ActionConfigType | undefined,
    name: ActionType,
    payload: unknown,
    config: ConfigType
  ) {
    // Case property value is not defined, we simply return
    if (!_action) {
      return;
    }

    // Case developper provides a handle method instead of allowing the component to provide
    // action handler, we call developper handle method
    if (typeof (_action as ActionHandlerType).handle === 'function') {
      return (_action as ActionHandlerType).handle.call(
        null,
        payload,
        this,
        config
      );
    }

    // Else we assume a configuration url is provided, and we must send
    // an HTTP request with the provided payload
    return this.handleCustomAction.call(
      this,
      name,
      payload,
      _action as CustomActionConfigType,
      config?.url ?? this.url
    );
  }

  private async handleCustomAction(
    name: string,
    payload: unknown,
    action: CustomActionConfigType,
    _url: string
  ) {
    _url = _url ?? action.url;
    this.onStartAction();
    return await lastValueFrom(
      this.customAction
        .handle(_url, payload, action, (err) => {
          this.onActionError({ type: 'update', err });
        })
        .pipe(tap((payload) => this.onActionResult({ type: name, payload })))
    );
  }

  /** @description Control or change component local state object */
  private setState(
    _partial: Partial<StateType> | ((_state: StateType) => StateType)
  ) {
    if (typeof _partial === 'function' && _partial !== null) {
      this._state = _partial({ ...this.state });
    } else {
      this._state = { ...this.state, ..._partial };
    }
    this.cdRef?.markForCheck();

    // Emit an event each time the state changes
    this.stateChange.emit(this._state);
  }

  private onActionError(action: {
    type: ActionType;
    err: unknown;
    message?: string;
  }) {
    this.actionError.emit(action);
  }

  private onActionResult(action: {
    type: string;
    payload: unknown;
    message?: string;
  }) {
    refreshCachedQueries(this._state.cachedQueries, (queries) => {
      this.setState({ cachedQueries: queries });
    });
    this.actionResult.emit(action);
  }

  private onStartAction() {
    this.performingAction.emit(true);
  }

  private onEndAction() {
    this.performingAction.emit(false);
  }

  private createBuilder(config: ConfigType) {
    if (!config.form) {
      return null;
    }

    const builderFactory =
      (f: FormConfigInterface) =>
      (excluded: string[] = [], notRequired: string[] = []) =>
        createFormConfig(f, excluded ?? [], notRequired ?? []);

    if ('id' in config.form && (config.form as AssetFormConfigType)?.id) {
      const { id } = config.form as AssetFormConfigType;
      return this.client.get(id).pipe(
        filter((form) => typeof form !== 'undefined' && form !== null),
        map((form) => builderFactory(form))
      );
    }

    if ('value' in config.form && (config.form as JsFormConfigType)?.value) {
      const { value } = config.form as JsFormConfigType;
      return of(builderFactory(value));
    }

    return null;
  }

  ngOnDestroy() {
    if (this.cdRef) {
      this.cdRef = null;
    }

    if (this.subscriptions) {
      for (const subscription of this.subscriptions) {
        subscription.unsubscribe();
      }
    }
  }
}
