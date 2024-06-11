import { DataConfigArgType } from '..';

/** @internal Type declaration for pages configuration */
export type ViewConfig = {
  href: string;
  config: DataConfigArgType;
};

/** @internal */
export type LinkConfigPair = {
  href: any;
  config?: DataConfigArgType;
  links?: LinkConfigPair[];
};
