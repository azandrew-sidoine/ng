import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  Optional,
  TemplateRef,
} from '@angular/core';
import { HEADER_DIRECTIVES } from '../header';
import { APP_LINKS, MAIN_NAV_DIRECTIVES } from '../main-nav';
import { HEADER_ACTIONS_DIRECTIVES } from '../header/actions';
import { ViewportModule } from '../viewport';
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
  VIEW_LAYOUT,
  ViewLayout,
} from './types';
import { CLR_SIDENAV_DIRECTIVES } from '../clr-sidenav';
import { LINK_DIRECTIVE, Link } from '../link';

@Component({
  imports: [
    CommonModule,
    ViewportModule,
    ClarityModule,
    RouterModule,
    ...HEADER_ACTIONS_DIRECTIVES,
    ...MAIN_NAV_DIRECTIVES,
    ...LINK_DIRECTIVE,
    ...HEADER_DIRECTIVES,
    ...CLR_SIDENAV_DIRECTIVES,
  ],
  standalone: true,
  selector: 'ngx-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements AfterViewInit, OnDestroy {
  // #region Component children
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  // #endregion List component children

  // #region Component inputs
  private _path!: string;
  @Input() set path(value: string) {
    this._path = value;
  }
  get path() {
    return this._path;
  }
  @Input() branding = this.appMetadata?.branding;
  @Input() logo = this.appMetadata?.logo;
  @Input() name: string = this.route.snapshot.data['name'];
  @Input() noHeader: boolean = false;
  @Input() links: Link[] = this.route.snapshot.data['links'];
  @Input() cssClass: string = '';
  @Input() sidenav!: TemplateRef<any> | null;
  // #endregion Component inputs

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  // #endregion Component internal properties

  // Class constructor
  constructor(
    @Inject(APP_LINKS) @Optional() private _links$: Observable<Link[]>,
    private route: ActivatedRoute,
    private changes: ChangeDetectorRef,
    @Inject(VIEW_LAYOUT) @Optional() public layout: ViewLayout = 'default',
    @Inject(APP_METADATA) @Optional() public appMetadata?: AppMetadataType
  ) {}

  ngAfterViewInit(): void {
    // Case the links input does not have value, we load links from the global application link
    if (this._links$ && !this.links) {
      // Subscribe to the global application links and set the component links
      const subscription = this._links$
        .pipe(
          filter((value) => typeof value !== 'undefined' && value !== null),
          distinctUntilChanged(),
          tap((value) => {
            this.links = value;
            this.changes?.detectChanges();
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
