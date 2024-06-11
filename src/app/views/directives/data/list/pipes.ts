import { Pipe, PipeTransform } from '@angular/core';

/** @internal */
type ValueArgType = string | ((item: unknown) => string);

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

/** Exported standalone pipes */
export const PIPES = [ActionTitlePipe, DisabledActionPipe] as const;
