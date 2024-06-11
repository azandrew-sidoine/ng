import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DataComponent } from './data.component';
import {
  CREATE_ACTION_HANDLER,
  DELETE_ACTION_HANDLER,
  REQUEST_CLIENT,
  UPDATE_ACTION_HANDLER,
} from './tokens';
import {
  CreateQueryActionHandler,
  DeleteQueryActionHandler,
  UpdateQueryActionHandler,
} from './handlers';
import { NgHttpRequestClient } from './ng-http-client';
import { DataDetailModule } from './detail';
import { DataFormModule } from './form';
import { DataListModule } from './list';
import { CommonStringsType } from './types';
import {
  NgxCommonModule,
  ProvideCommonStringsType,
  provideCommonStrings,
} from '@azlabsjs/ngx-common';
import { FORM_MODAL_DIRECTIVES } from '../forms';
import { COMMON_PIPES } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    DataListModule,
    DataFormModule,
    DataDetailModule,
    NgxCommonModule,
    ...COMMON_PIPES,
    ...[FORM_MODAL_DIRECTIVES],
  ],
  exports: [DataComponent, DataListModule, DataDetailModule, NgxCommonModule],
  declarations: [DataComponent],
  providers: [
    {
      provide: REQUEST_CLIENT,
      useClass: NgHttpRequestClient,
    },
    {
      provide: DELETE_ACTION_HANDLER,
      useClass: DeleteQueryActionHandler,
    },
    {
      provide: UPDATE_ACTION_HANDLER,
      useClass: UpdateQueryActionHandler,
    },
    {
      provide: CREATE_ACTION_HANDLER,
      useClass: CreateQueryActionHandler,
    },
  ],
})
export class DataComponentModule {
  /**
   * @deprecated Use the `provideCommonStrings` provider from `@azlabsjs/ngx-common` to load common strings
   */
  static forRoot(
    strings: ProvideCommonStringsType<CommonStringsType>
  ): ModuleWithProviders<DataComponentModule> {
    return {
      ngModule: DataComponentModule,
      providers: [provideCommonStrings(strings)],
    };
  }
}
