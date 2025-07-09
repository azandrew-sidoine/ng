import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIStateControllerType, UI_STATE_CONTROLLER } from '../../ui-events';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_LINKS } from '../../nav/main';
import { CommonModule } from '@angular/common';
import { VIEW_DIRECTIVES } from '../../view';
import { Link } from '../../nav';
import { DATA_DIRECTIVES } from '../base';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { ROUTER_PIPES } from '../../router';
import {
  ActionType,
  DataComponentType,
  StateType as DataStateType,
  ViewStateComponentType,
  ViewStateType,
} from '../core';

/**  @internal */
type NullableEntityType = { id: string | number } | undefined | null;

/** @internal */
type ActionResultType = {
  type: ActionType | string;
  payload: unknown;
  message?: string;
};

/** @internal */
type ActionErrorType = {
  type: ActionType | string;
  err: unknown;
  message?: string;
};

/** @internal */
type StateType = {
  view: ViewStateType;
  params: Record<string, unknown>;
};

/** @internal */
function snapshot<T>(route: ActivatedRoute, key: string, _default: T) {
  return (route.snapshot.data[key] as any as T) ?? _default;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ...COMMON_PIPES,
    ...VIEW_DIRECTIVES,
    ...DATA_DIRECTIVES,
    ...ROUTER_PIPES,
  ],
  selector: 'ngx-data-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent
  implements ViewStateComponentType, OnDestroy, AfterViewInit
{
  // #region Component inputs
  @Input() path!: string;
  @Input({ alias: 'no-modal' }) noModal = snapshot(
    this.route,
    'no-modal',
    false
  );
  @Input({ alias: 'no-padding' }) noPadding = snapshot(
    this.route,
    'no-padding',
    true
  );
  @Input({ alias: 'no-header' }) noHeader = snapshot(
    this.route,
    'no-header',
    false
  );
  @Input() module = snapshot<string | null>(this.route, 'module', null);
  @Input() links = snapshot<Link[] | null>(this.route, 'links', null);
  @Input() view!: ViewStateType;
  // #endregion Component inputs

  // #region Component children
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  @ContentChild('header') headerRef!: TemplateRef<unknown>;
  @ContentChild('listView') listRef!: TemplateRef<unknown>;
  @ContentChild('gridView') gridRef!: TemplateRef<unknown>;
  @ContentChild('overflow') overflowRef!: TemplateRef<any>;
  @ContentChild('actionBar') actionBarRef!: TemplateRef<any>;
  @ContentChild('detailPane') detailPaneRef!: TemplateRef<any>;
  @ContentChild('beforeDetail') beforeDetailRef!: TemplateRef<unknown>;
  @ContentChild('afterDetail') afterDetailRef!: TemplateRef<unknown>;
  // #endregion List component children

  // #region Component outputs
  @Output() detailChange = new EventEmitter<unknown>();
  @Output() formError = new EventEmitter<unknown>();
  @Output() formReady = new EventEmitter<NullableEntityType>();
  @Output() formChanges = new EventEmitter<unknown>();
  @Output() stateChange = new EventEmitter<DataStateType>();
  // #endregion Components outputs

  // Child view reference
  @ViewChild('dataRef', { static: false }) dataViewRef!: DataComponentType;

  // #region Component internal properties

  private _formValue$ = new BehaviorSubject<Record<string, unknown> | null>(
    null
  );
  private _subscriptions: Subscription[] = [
    this.route.queryParamMap
      .pipe(
        tap((q) => {
          const queries = q.keys;
          const state: Record<string, unknown> = {};
          for (const k of queries) {
            const value = q.get(k);
            if (!value) {
              continue;
            }
            state[k] = decodeURIComponent(value);
          }
          this._formValue$.next(state);
        })
      )
      .subscribe(),
    this.route.queryParams.subscribe((params) =>
      this.setState((s) => ({
        ...s,
        params,
        view: (params['view'] ??
          params['view_mode'] ??
          s.view) as unknown as ViewStateType,
      }))
    ),
  ];
  private _state: StateType = { view: 'listView', params: {} };
  get state() {
    return this._state;
  }
  // #endregion Component internal properties

  // Class constructor
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(UI_STATE_CONTROLLER) private controller: UIStateControllerType,
    @Inject(APP_LINKS) @Optional() private _links$: Observable<Link[]>,
    @Optional() private cdRef: ChangeDetectorRef | null
  ) {}

  ngAfterViewInit(): void {
    // Case the links input does not have value, we load links from the global application link
    if (this._links$ && !this.links) {
      // Subscribe to the global application links and set the component links
      const subscription = this._links$
        .pipe(
          filter((value) => typeof value !== 'undefined' && value !== null),
          distinctUntilChanged(),
          tap((value) => (this.links = value))
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }

  onPerformingAction(value: boolean) {
    if (value) {
      return this.controller.startAction();
    }
    return this.controller.endAction();
  }

  onActionError(action: ActionErrorType) {
    this.controller.endAction(action.message ?? '', 'request-error');
  }

  onActionResult(action: ActionResultType) {
    this.controller.endAction(action?.message ?? '', 'success');
  }

  onFormReady(selected?: NullableEntityType, config?: any) {
    setTimeout(() => {
      if (!this.dataViewRef) {
        return;
      }
      const state = this._formValue$.getValue();
      if (state) {
        this.dataViewRef?.form?.setValue(state);
      }
      this._formValue$.next(null);
    }, 300);
    this.formReady.emit(selected);
  }

  onDetailChange(event: unknown) {
    this.detailChange.emit(event);
  }

  onFormError(event: unknown) {
    this.formError.emit(event);
  }

  onFormChanges(event: unknown) {
    this.formChanges.emit(event);
  }

  onStateChanges(event: DataStateType) {
    this.stateChange.emit(event);
  }

  onFormClosed() {
    this.router.navigate([]);
  }

  ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription?.unsubscribe();
    }
  }

  private setState(fn: (s: StateType) => StateType) {
    this._state = fn(this._state);
    this.cdRef?.markForCheck();
  }
}
