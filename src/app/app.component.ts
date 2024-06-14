import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { HttpClientModule } from '@angular/common/http';
import { UI_STATE_DIRECTIVES } from './views/directives/ui-action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    TranslateModule,
    ...COMMON_PIPES,
    ...UI_STATE_DIRECTIVES,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  //#region component inputs
  @Input() name: string = environment.name;
  //#endregion component inputs
}
