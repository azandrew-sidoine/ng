import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { ConfigType } from './types';
import { COMMON_PIPES } from '@azlabsjs/ngx-common';
import { NgxComponentOutlet } from './ng_component_outlet.directive';
import { InputsPipe } from './pipes';

@Component({
  standalone: true,
  imports: [CommonModule, NgxComponentOutlet, InputsPipe, ...COMMON_PIPES],
  selector: 'ngx-l-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnDestroy {
  //#region Component inputs
  @Input() config!: ConfigType;
  //#endregion Component inputs

  //
  ngOnDestroy(): void {}
}
