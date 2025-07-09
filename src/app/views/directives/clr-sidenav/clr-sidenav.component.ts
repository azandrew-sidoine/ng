import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { RouterModule } from '@angular/router';
import { LINK_DIRECTIVE, Link, UILink } from '../nav';
import { URLChanges } from '../router';
import { Subscription, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ClarityModule, RouterModule, ...LINK_DIRECTIVE],
  selector: 'ngx-clr-sidenav',
  templateUrl: './clr-sidenav.component.html',
  styleUrls: ['./clr-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrSidenavComponent {
  //#region Component inputs
  @Input() uiLinks!: UILink[];
  @Input() links!: Link[];
  @Input() avatar!: string | undefined | null;
  /**
   * Before update url function controls wether the url should be updated by the internal router
   * If function returns false, internal router does not update the url, else it updates the url
   */
  @Input() beforeUpdateUrl!: (value: UILink) => boolean;
  //#endregion Component inputs

  // #region Component outputs
  @Output() linkClick = new EventEmitter<UILink>();
  @Output() urlChange = new EventEmitter<string>();
  // #endregion Component outputs

  // #region Component internal properties
  private _subscriptions: Subscription[] = [];
  currentUrl!: string;
  // #endregion Component internal properties

  //
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
