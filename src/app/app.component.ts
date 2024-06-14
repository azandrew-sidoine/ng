import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { UI_STATE_DIRECTIVES } from './views/directives/ui-events';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...UI_STATE_DIRECTIVES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  //#region component inputs
  @Input() name: string = environment.name;
  //#endregion component inputs
}
