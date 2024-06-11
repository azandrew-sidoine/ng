import { Injector } from '@angular/core';
import { Route } from '@angular/router';
import { Link as BaseLink, UILink as BaseUILink} from '../link';

/**
 * Navigation link property type declaration
 * @internal
 */
export type HRefType = string | ((injector: Injector) => void | Promise<void>);

/**
 * @deprecated
 * 
 * @internal
 * 
 * Top bar links type declarations
 */
export type Link =  BaseLink;

/**
 * @internal
 * Provides type declarations for links that are scoped
 */
export type ScopedLink = {
  label: string;
  href: string;
  icon?: string;
  scopes?: string[];
  cssClass?: string;
  links?: ScopedLink[];
};

/**
 * @deprecated
 * 
 * @internal
 */
export type UILink = BaseUILink;

/**
 * Header link type declaration for link
 */
export type AppLink<T = { [prop: string]: unknown }> = {
  label: string;
  href: HRefType;
  icon?: string;
  scopes?: string[];
  cssClass?: string;
  config?: T;
  links?: AppLink<T>[];
  routeConfig?: Partial<Route> & {
    implicit?: boolean;
  };
};

/**
 * Type declaration for header links
 */
export type AppLinks<T = { [prop: string]: unknown }> = AppLink<T>[];
