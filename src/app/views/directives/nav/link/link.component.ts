import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { NAVIGATE_HANDLER_FACTORY, NavigateHandlerFactory } from '../../router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UILink } from './types';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-link',
  templateUrl: './link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  // #region Component inputs
  @Input() link!: UILink;
  /**
   * Before update url function controls wether the url should be updated by the internal router
   * If function returns false, internal router does not update the url, else it updates the url
   */
  @Input() beforeUpdateUrl!: (value: UILink) => boolean;
  @Input() linkRef!: TemplateRef<any>;
  @ContentChild('view') viewRef!: TemplateRef<any> | null;
  // #endregion Component inputs

  // #region Component output
  @Output() linkClick = new EventEmitter<UILink>();
  // #endregion Component outputs

  //
  constructor(
    private injector: Injector,
    @Inject(NAVIGATE_HANDLER_FACTORY)
    @Optional()
    private navigateFactory?: NavigateHandlerFactory,
    @Optional()
    @Inject(DOCUMENT)
    private document?: Document
  ) {}

  //
  handleClick(event: Event, value: UILink) {
    event?.preventDefault();

    if (typeof value.href === 'function') {
      return value.href(this.injector);
    }

    const isValidURL = (url: string) => {
      try {
        const _url = new URL(url);
        return typeof _url.protocol !== 'undefined' && _url.protocol !== null;
      } catch {
        return false;
      }
    };

    if (isValidURL(value.href as string)) {
      const { defaultView } = this.document ?? {};
      if (!defaultView) {
        throw new Error('window instance is not defined');
      }
      defaultView.location.href = value.href;
      return;
    }

    if (this.navigateFactory) {
      const _beforeUpdateUrl =
        this.beforeUpdateUrl ??
        (() => {
          return true;
        });
      if (_beforeUpdateUrl(value)) {
        this.navigateFactory(this.injector).call(value.href as string);
      }
    }

    // We still emit the clicked element for user to handle the click action
    this.linkClick.emit(value);
  }
}
