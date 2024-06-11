import { NgModule } from '@angular/core';
import { DataDetailComponent } from './detail.component';
import { CommonModule } from '@angular/common';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { COMMON_PIPES } from '../pipes';

@NgModule({
  imports: [CommonModule, NgxCommonModule, ...COMMON_PIPES],
  exports: [DataDetailComponent],
  declarations: [DataDetailComponent],
})
export class DataDetailModule {}
