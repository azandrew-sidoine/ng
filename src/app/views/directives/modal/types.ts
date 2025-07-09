import { Injector, Type } from '@angular/core';

/** @description Modal component type reference */
export type ModalElement = {
  /**
   * Manually closes the modal.
   */
  close(): void;

  /**
   * Manually opens the modal.
   */
  open(): void;
};

/** @description Modal size type declaration */
export type SizeType = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Projected component outlet configuration */
export type OutletConfig = {
  /** Component object must support data and columns properties as input */
  component: Type<any>;
  inputs?:
    | Record<string, unknown>
    | ((injector: Injector) => Record<string, unknown>);
  module?: Type<any>;
  injector?: Injector;
  content?: any[][];
};
