import { Injector } from '@angular/core';

/**
 * Navigation link property type declaration
 *
 * @internal
 */
export type HRefType = string | ((injector: Injector) => void | Promise<void>);

/**
 * UI Link type declaration
 */
export type UILink = {
  label: string;
  href: HRefType;
  icon?: string;
  cssClass?: string;
};

/**
 * Application navigation links type declaration
 */
export type Link = {
  label: string;
  href: HRefType;
  icon?: string;
  cssClass?: string;
  links?: Link[];
};
