import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Provider,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { provideHttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        TranslateModule,
        ...COMMON_PIPES,
    ],
    providers: [provideHttpClient() as unknown as Provider],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  //#region component inputs
  @Input() name: string = environment.name;
  //#endregion component inputs
}
