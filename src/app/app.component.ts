import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { UI_STATE_DIRECTIVES } from './views/directives/ui-events';
import { SEARCH_DIRECTIVES } from './views/directives/search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...UI_STATE_DIRECTIVES, ...SEARCH_DIRECTIVES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  //#region component inputs
  @Input() name: string = environment.name;
  //#endregion component inputs


  handleSearchValueChange(e: any) {
    console.log('Search value changes...', e);
  }
}
