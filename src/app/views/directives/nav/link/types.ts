import { Injector } from '@angular/core';

/** @internal Navigation link property type declaration */
export type HRefType = string | ((injector: Injector) => void | Promise<void>);

/** @description UI Link type declaration */
export type UILink = {
  label: string;
  href: HRefType;
  icon?: string;
  cssClass?: string;
};

/** @description Application navigation links type declaration */
export type Link = {
  label: string;
  href: HRefType;
  icon?: string;
  cssClass?: string;
  links?: Link[];
};
