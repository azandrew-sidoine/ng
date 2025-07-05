import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LINK_DIRECTIVE, UILink } from '../link';
import { URLChanges } from '../router';
import { DROPDOWN_DIRECTIVES } from '@azlabsjs/ngx-dropdown';

@Component({
    imports: [CommonModule, ...DROPDOWN_DIRECTIVES, ...LINK_DIRECTIVE],
    selector: 'ngx-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnDestroy, AfterViewInit {
  // #region Component inputs
  @Input({alias: 'icon-size'}) iconSize: number = 36;
  @Input() links: UILink[] = [];
  /**
   * Before update url function controls wether the url should be updated by the internal router
   * If function returns false, internal router does not update the url, else it updates the url
   */
  @Input() beforeUpdateUrl!: (value: UILink) => boolean;
  // #endregion Component inputs

  // #region Component outputs
  @Output() linkClick = new EventEmitter<UILink>();
  @Output() urlChange = new EventEmitter<string>();
  // #endregion Component outputs

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  currentUrl!: string;
  // #endregion Component internal properties

  constructor(private urlChanges: URLChanges) {}

  //
  ngAfterViewInit(): void {
    const subscription = this.urlChanges.state$
      .pipe(
        tap((url) => {
          if (url) {
            this.currentUrl = url;
            this.urlChange.emit(url);
          }
        })
      )
      .subscribe();

    this._subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for (const suscription of this._subscriptions) {
      suscription?.unsubscribe();
    }
  }
}
