import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { HeaderNavLinkComponent } from './nav-link.component';
import { CommonModule } from '@angular/common';
import { Link } from '../../link';
import { RouterModule } from '@angular/router';
import { COMMON_PIPES as PIPES } from '../pipes';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';

@Component({
    imports: [
        HeaderNavLinkComponent,
        CommonModule,
        RouterModule,
        ...PIPES,
        ...COMMON_PIPES,
    ],
    selector: 'ngx-header-nav',
    templateUrl: './nav.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent {
  //#region Component inputs
  @Input() link!: Link;
  @Input('navText') navTextRef!: TemplateRef<unknown>;
  //#endregion Component inputs
}
