import { Injector } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Navigation link property type declaration
 * @internal
 */
export type HRefType = string | ((injector: Injector) => void | Promise<void>);

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

/** @description Type declaration for header links */
export type AppLinks<T = { [prop: string]: unknown }> = AppLink<T>[];

/** @internal @deprecated */
export type AuthFactory = (injector: Injector) => {
  signInState$: Observable<{
    scopes: string[];
  }>;
};

// @internal
type ObservableOr<T> = T | Observable<T>;

/** @internal */
export type HasScopeFactory = (
  injector: Injector
) => ObservableOr<(scopes: string[]) => boolean>;

/** @internal */
export type TranslationFactory = (
  injector: Injector
) => (p: string | string[]) => Observable<{ [prop: string]: any }>;
