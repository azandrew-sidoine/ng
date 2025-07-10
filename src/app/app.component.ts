import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { DIRECTIVES as SIDEPANE_DIRECTIVES } from './views/directives/sidepane';
// import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TranslateModule,
    ...COMMON_PIPES,
    ...SIDEPANE_DIRECTIVES,
  ],
  providers: [], // provideHttpClient() as unknown as Provider
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
