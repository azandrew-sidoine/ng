/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ComponentRef,
  createNgModule,
  Directive,
  DoCheck,
  Injector,
  Input,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  OutputRef,
  OutputRefSubscription,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';



// Helper function that returns an Injector instance of a parent NgModule.
function getParentInjector(injector: Injector): Injector {
    const parentNgModule = injector.get(NgModuleRef);
    return parentNgModule.injector;
  }
  

/**
 * Instantiates a {@link Component} type and inserts its Host View into the current View.
 * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
 *
 * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
 * any existing component will be destroyed.
 *
 * @usageNotes
 *
 * ### Fine tune control
 *
 * You can control the component creation process by using the following optional attributes:
 *
 * * `ngxComponentOutletInputs`: Optional component inputs object, which will be bind to the
 * component.
 *
 * * `ngxComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
 * the Component. Defaults to the injector of the current view container.
 *
 * * `ngxComponentOutletContent`: Optional list of projectable nodes to insert into the content
 * section of the component, if it exists.
 *
 * * `ngxComponentOutletNgModule`: Optional NgModule class reference to allow loading another
 * module dynamically, then loading a component from that module.
 *
 * * `ngxComponentOutletNgModuleFactory`: Deprecated config option that allows providing optional
 * NgModule factory to allow loading another module dynamically, then loading a component from that
 * module. Use `ngxComponentOutletNgModule` instead.
 *
 * ### Syntax
 *
 * Simple
 * ```
 * <ng-container *ngxComponentOutlet="componentTypeExpression"></ng-container>
 * ```
 *
 * With inputs
 * ```
 * <ng-container *ngxComponentOutlet="componentTypeExpression;
 *                                   inputs: inputsExpression;">
 * </ng-container>
 * ```
 *
 * Customized injector/content
 * ```
 * <ng-container *ngxComponentOutlet="componentTypeExpression;
 *                                   injector: injectorExpression;
 *                                   content: contentNodesExpression;">
 * </ng-container>
 * ```
 *
 * Customized NgModule reference
 * ```
 * <ng-container *ngxComponentOutlet="componentTypeExpression;
 *                                   ngModule: ngModuleClass;">
 * </ng-container>
 * ```
 *
 *
 * @publicApi
 * @ngModule CommonModule
 */
@Directive({
  standalone: true,
  selector: '[ngxComponentOutlet]',
})
export class NgxComponentOutlet implements OnChanges, DoCheck, OnDestroy {
  @Input() ngxComponentOutlet: Type<any> | null = null;
  @Input() ngxComponentOutletInputs?: Record<string, unknown>;
  @Input() ngxComponentOutletOutputs?: Record<string, (value: any) => void>;
  @Input() ngxComponentOutletInjector?: Injector;
  @Input() ngxComponentOutletContent?: any[][];
  @Input() ngxComponentOutletNgModule?: Type<any>;

  private _componentRef: ComponentRef<any> | undefined;
  private _moduleRef: NgModuleRef<any> | undefined;

  /**
   * A helper data structure that allows us to track inputs that were part of the
   * ngComponentOutletInputs expression. Tracking inputs is necessary for proper removal of ones
   * that are no longer referenced.
   */
  private _inputsUsed = new Map<string, boolean>();
  private _outputSubscriptions: OutputRefSubscription[] = [];

  constructor(private _viewContainerRef: ViewContainerRef) {}

  private _needToReCreateNgModuleInstance(changes: SimpleChanges): boolean {
    // Note: square brackets property accessor is safe for Closure compiler optimizations (the
    // `changes` argument of the `ngOnChanges` lifecycle hook retains the names of the fields that
    // were changed).
    return (
      changes['ngComponentOutletNgModule'] !== undefined ||
      changes['ngComponentOutletNgModuleFactory'] !== undefined
    );
  }

  private _needToReCreateComponentInstance(changes: SimpleChanges): boolean {
    // Note: square brackets property accessor is safe for Closure compiler optimizations (the
    // `changes` argument of the `ngOnChanges` lifecycle hook retains the names of the fields that
    // were changed).
    return (
      changes['ngComponentOutlet'] !== undefined ||
      changes['ngComponentOutletContent'] !== undefined ||
      changes['ngComponentOutletInjector'] !== undefined ||
      this._needToReCreateNgModuleInstance(changes)
    );
  }

  /** @nodoc */
  ngOnChanges(changes: SimpleChanges) {
    if (this._needToReCreateComponentInstance(changes)) {
      this._viewContainerRef.clear();
      this._inputsUsed.clear();
      this._componentRef = undefined;

      if (this.ngxComponentOutlet) {
        const injector =
          this.ngxComponentOutletInjector ||
          this._viewContainerRef.parentInjector;

        if (this._needToReCreateNgModuleInstance(changes)) {
          this._moduleRef?.destroy();

          if (this.ngxComponentOutletNgModule) {
            this._moduleRef = createNgModule(
              this.ngxComponentOutletNgModule,
              getParentInjector(injector)
            );
          } else {
            this._moduleRef = undefined;
          }
        }

        this._componentRef = this._viewContainerRef.createComponent(
          this.ngxComponentOutlet,
          {
            injector,
            ngModuleRef: this._moduleRef,
            projectableNodes: this.ngxComponentOutletContent,
          }
        );

        // First clear any previous outputs subscriptions
        this._clearOutputSubscriptions();

        // It provides an implementation to attach a function to the
        // component output
        if (this._componentRef.instance) {
          const instance = this._componentRef.instance as Object &
            Record<string, OutputRef<any>>;
          const outputs = this.ngxComponentOutletOutputs;
          for (const key in outputs) {
            if (
              Object.prototype.hasOwnProperty.call(outputs, key) &&
              Object.prototype.hasOwnProperty.call(instance, key) &&
              typeof instance[key].subscribe === 'function'
            ) {
              instance[key].subscribe(outputs[key]);
            }
          }
        }
      }
    }
  }

  /** @nodoc */
  ngDoCheck() {
    if (this._componentRef) {
      if (this.ngxComponentOutletInputs) {
        for (const inputName of Object.keys(this.ngxComponentOutletInputs)) {
          this._inputsUsed.set(inputName, true);
        }
      }

      this._applyInputStateDiff(this._componentRef);
    }
  }

  /** @nodoc */
  ngOnDestroy() {
    this._clearOutputSubscriptions();
    this._moduleRef?.destroy();
  }

  private _applyInputStateDiff(componentRef: ComponentRef<unknown>) {
    for (const [inputName, touched] of this._inputsUsed) {
      if (!touched) {
        // The input that was previously active no longer exists and needs to be set to undefined.
        componentRef.setInput(inputName, undefined);
        this._inputsUsed.delete(inputName);
      } else {
        // Since touched is true, it can be asserted that the inputs object is not empty.
        componentRef.setInput(
          inputName,
          this.ngxComponentOutletInputs![inputName]
        );
        this._inputsUsed.set(inputName, false);
      }
    }
  }
  private _clearOutputSubscriptions() {
    for (const subscription of this._outputSubscriptions) {
      subscription?.unsubscribe();
    }
    this._outputSubscriptions = [];
  }
}