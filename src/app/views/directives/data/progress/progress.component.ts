import { Component, Inject, Input, Optional } from '@angular/core';
import { Position, PROGRESS_DIRECTIVES } from '../../progress';
import { CommonModule } from '@angular/common';
import { EXPORT_PROGRESS, ProgressHandler, ProgressStateType } from '../utils';
import { of, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [...PROGRESS_DIRECTIVES, CommonModule],
  selector: 'ngx-data-progress',
  templateUrl: './progress.component.html',
})
export class ProgressComponent {
  //#region Component inputs
  @Input() text: string = 'Exporting please wait...';
  @Input() position: Position = 'top-center';
  //#endregion Component inputs

  // #region Component properties
  public readonly state$ = !this.progress ? of(null) : this.progress.state$;
  //#endregion Component properties

  constructor(
    @Optional()
    @Inject(EXPORT_PROGRESS)
    private progress: ProgressHandler<ProgressStateType> | null
  ) {}
}
