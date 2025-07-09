import { Injector, Type } from '@angular/core';

/** @internal */
type ViewConfigType = {
  component: Type<any>;
  inputs?: Record<string, unknown>|((injector: Injector) => Record<string, unknown>);
  module?: Type<any>;
  injector?: Injector;
  content?: any[][];
  outputs: Record<string, (value: unknown) => void>;
};

/** @internal */
export type ConfigType = Array<ViewConfigType & { growth?: number }>[];
