import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  Injector,
  Input,
  Optional,
  TemplateRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HEADER_NAV_DIRECTIVES } from './nav';
import {
  HEADER_ACTIONS_FACTORY,
  HeaderAction,
  HeaderActionsFactory,
} from './actions';
import { Observable, of } from 'rxjs';
import { Link } from '../link';
import { COMMON_PIPES } from './pipes';

// TODO: Move logout dependencies to another component

@Component({
  standalone: true,
  imports: [
    ...HEADER_NAV_DIRECTIVES,
    ...COMMON_PIPES,
    CommonModule,
    RouterModule,
  ],
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // #region Component projected contents
  @ContentChild('actions') actionsRef!: TemplateRef<unknown>;
  @ContentChild('linkTemplate') linkRef!: TemplateRef<unknown>;
  @ContentChild('navTemplate') navRef!: TemplateRef<unknown>;
  @ContentChild('navText') navTextRef!: TemplateRef<unknown>;
  // #endregion Component projected contents

  // #region Component inputs
  @Input({ alias: 'branding' }) branding!: TemplateRef<unknown>;
  @Input() links: Link[] | null = [];
  @Input({ alias: 'class' }) cssClass: string | undefined = 'basic';
  @Input() name!: string | null;
  @Input({ alias: 'module' }) module!: string;
  @Input() actions: HeaderAction[] = [];
  @Input() logo!: string | null | undefined;
  // #endregion Component inputs

  // #region Component internal properties
  actions$!: Observable<HeaderAction[]>;
  // #endregion Component internal properties

  // Class constructor
  constructor(
    private injector: Injector,
    @Optional()
    @Inject(HEADER_ACTIONS_FACTORY)
    factory?: HeaderActionsFactory
  ) {
    this.actions$ =
      factory && typeof factory === 'function'
        ? factory(this.injector)
        : of([]);
  }
}
