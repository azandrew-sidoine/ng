import { Injector, Optional, Pipe, PipeTransform } from '@angular/core';
import { from, isObservable, of } from 'rxjs';

/** @internal */
type ValueArgType = string | ((item: unknown) => string);

/**
 * Checks if a provided value is a promise or not
 */
function isPromise<T>(a: unknown): a is Promise<T> {
  return (
    typeof a === 'object' &&
    a !== null &&
    typeof (a as Promise<T>).then === 'function' &&
    typeof (a as Promise<T>).catch === 'function'
  );
}

@Pipe({
  standalone: true,
  name: 'array',
  pure: true,
})
export class ArrayPipe implements PipeTransform {
  // Return the value passed as array
  transform(value: any): any[] {
    return Array.isArray(value)
      ? value
      : typeof value === 'undefined' || value == null
      ? []
      : [value];
  }
}

@Pipe({
  standalone: true,
  name: 'asObservable',
  pure: true,
})
export class AsObservablePipe implements PipeTransform {
  //
  constructor(@Optional() private injector?: Injector) {}

  /**
   * Transform or convert basic value to an observable of T value.
   */
  transform(value: any) {
    const _value = typeof value === 'function' ? value(this.injector) : value;
    return isObservable(_value) || isPromise(_value)
      ? from<any>(_value)
      : of<any>(_value);
  }
}

@Pipe({
  standalone: true,
  name: 'actionTitle',
  pure: true,
})
export class ActionTitlePipe implements PipeTransform {
  /**
   * Transform the provided value and return the title string
   */
  transform(value: ValueArgType, item?: unknown): string {
    if (typeof value === 'function') {
      return value.call(null, item);
    }
    return value;
  }
}

@Pipe({
  standalone: true,
  name: 'supported',
  pure: true,
})
export class ActionSupportedPipe implements PipeTransform {
  transform(value: string, actions: string[]) {
    return (actions ?? ([] as string[])).indexOf(value) !== -1;
  }
}

@Pipe({
  standalone: true,
  name: 'asAny',
  pure: true,
})
export class AsAnyPipe implements PipeTransform {
  // Cast the provided value as any
  transform(value: unknown) {
    return value as any;
  }
}

@Pipe({
  standalone: true,
  name: 'disabledAction',
  pure: true,
})
export class DisabledActionPipe implements PipeTransform {
  //
  transform(
    value: unknown,
    fn: boolean | undefined | ((value: unknown) => boolean)
  ) {
    if (typeof fn === 'undefined' || fn === null) {
      return false;
    }
    return typeof fn === 'function' ? fn(value) : Boolean(value);
  }
}

/** Exported pipes */
export const COMMON_PIPES = [
  ActionSupportedPipe,
  AsObservablePipe,
  ActionTitlePipe,
  AsAnyPipe,
  DisabledActionPipe,
  ArrayPipe
] as const;
