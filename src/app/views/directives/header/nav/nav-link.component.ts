import {
  Component,
  HostBinding,
  Inject,
  Injector,
  Input,
  Optional,
  TemplateRef,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DropdownModule } from '@azlabsjs/ngx-dropdown';
import { Router, RouterModule } from '@angular/router';
import { UILink } from '../../link';

/** @internal */
function isValidURL(url: string) {
  try {
    const _url = new URL(url);
    return typeof _url.protocol !== 'undefined' && _url.protocol !== null;
  } catch {
    return false;
  }
}

@Component({
  imports: [CommonModule, DropdownModule, RouterModule],
  standalone: true,
  selector: 'ngx-header-nav-link',
  templateUrl: './nav-link.component.html',
})
export class HeaderNavLinkComponent {
  // #region Component inputs
  @HostBinding('class.links__nav-link') navlink = true;
  @Input() label!: string;
  @Input() links!: UILink[];
  @Input('navText') navTextRef!: TemplateRef<unknown>;
  // #endregion Component inputs

  constructor(
    private router: Router,
    private injector: Injector,
    @Optional()
    @Inject(DOCUMENT)
    private document?: Document
  ) {}

  onNavigate(event: Event, value: UILink) {
    if (typeof value.href === 'function') {
      return value.href(this.injector);
    }

    if (isValidURL(value.href as string)) {
      const { defaultView } = this.document ?? {};
      const _window = defaultView ?? window;
      _window.location.href = value.href;
    } else {
      this.router.navigateByUrl(value.href);
    }
    event?.preventDefault();
  }
}
