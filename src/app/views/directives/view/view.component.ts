import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { HEADER_DIRECTIVES } from '../nav/header';
import { APP_LINKS, MAIN_NAV_DIRECTIVES } from '../nav/main';
import { HEADER_ACTIONS_DIRECTIVES } from '../nav/header/actions';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs';
import { ClarityModule } from '@clr/angular';
import {
  APP_METADATA,
  AppMetadataType,
  Theme,
  VIEW_LAYOUT,
  ViewLayout,
} from './types';
import { CLR_SIDENAV_DIRECTIVES } from '../clr-sidenav';
import { LINK_DIRECTIVE, Link } from '../nav';

@Component({
    imports: [
        CommonModule,
        ClarityModule,
        RouterModule,
        ...HEADER_ACTIONS_DIRECTIVES,
        ...MAIN_NAV_DIRECTIVES,
        ...LINK_DIRECTIVE,
        ...HEADER_DIRECTIVES,
        ...CLR_SIDENAV_DIRECTIVES,
    ],
    selector: 'ngx-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, AfterViewInit, OnDestroy {
  // #region Component children
  @HostBinding('class.viewport') viewport = true;
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  // #endregion List component children

  // #region Component inputs
  @Input() name = this.metadata?.name ?? null;
  @Input() logo = this.metadata?.logo;
  @Input() noHeader: boolean = false;
  @Input() links: Link[] = this.route.snapshot.data['links'];
  @Input() cssClass: string = '';
  @Input() sidenav!: TemplateRef<any> | null;
  @Input() theme: Theme = this.metadata?.theme ?? 'light';
  private _path!: string;
  @Input() set path(value: string) {
    this._path = value;
  }
  get path() {
    return this._path;
  }
  // #endregion Component inputs

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  // #endregion Component internal properties

  //#region Component outputs
  @Output() searchParamChange = new EventEmitter<{ [key: string]: any }>();
  //#endregion Component outputs

  // Class constructor
  constructor(
    @Inject(APP_LINKS) @Optional() private _links$: Observable<Link[]>,
    private route: ActivatedRoute,
    private changes: ChangeDetectorRef,
    @Inject(VIEW_LAYOUT) @Optional() public layout: ViewLayout = 'default',
    @Inject(APP_METADATA) @Optional() public metadata?: AppMetadataType
  ) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this.route.queryParams
        .pipe(tap((params) => this.searchParamChange.emit(params)))
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    // case the links input does not have value, we load links from the global application link
    if (this._links$ && !this.links) {
      // Subscribe to the global application links and set the component links
      const subscription = this._links$
        .pipe(
          filter((value) => typeof value !== 'undefined' && value !== null),
          distinctUntilChanged(),
          tap((value) => {
            this.links = value;
            this.changes?.markForCheck();
          })
        )
        .subscribe();
      this._subscriptions.push(subscription);
    }
  }

  onUrlChange(event: string) {
    this._path = event;
    this.changes?.markForCheck();
  }

  ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription?.unsubscribe();
    }
  }
}
