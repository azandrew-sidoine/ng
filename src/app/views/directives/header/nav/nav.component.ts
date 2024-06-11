import { Component, Input, TemplateRef } from '@angular/core';
import { HeaderNavLinkComponent } from './nav-link.component';
import { CommonModule } from '@angular/common';
import { Link } from '../../link';
import { RouterModule } from '@angular/router';
import { COMMON_PIPES } from '../pipes';

@Component({
  imports: [
    HeaderNavLinkComponent,
    CommonModule,
    RouterModule,
    ...COMMON_PIPES,
  ],
  standalone: true,
  selector: 'ngx-header-nav',
  templateUrl: './nav.component.html',
})
export class HeaderNavComponent {
  //#region Component inputs
  @Input() link!: Link;
  @Input('navText') navTextRef!: TemplateRef<unknown>;
  //#endregion Component inputs
}
