import { NgModule } from '@angular/core';
import { DataListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { DATAGRID_DIRECTIVES } from '../../datagrid';
import { COMMON_PIPES } from '../pipes';

@NgModule({
  declarations: [DataListComponent],
  imports: [
    CommonModule,
    ClarityModule,
    NgxCommonModule,
    ...DATAGRID_DIRECTIVES,
    ...COMMON_PIPES,
  ],
  exports: [DataListComponent],
})
export class DataListModule {}
