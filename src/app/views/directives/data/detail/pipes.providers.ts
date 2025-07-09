import { CommonTextPipe } from '@azlabsjs/ngx-common';

import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  UpperCasePipe,
} from '@angular/common';

/** @internal Exposed list of pipes used as providers */
export const PIPES_PROVIDERS = [
  UpperCasePipe,
  LowerCasePipe,
  CurrencyPipe,
  DecimalPipe,
  JsonPipe,
  PercentPipe,
  SlicePipe,
  AsyncPipe,
  CommonTextPipe,
];
