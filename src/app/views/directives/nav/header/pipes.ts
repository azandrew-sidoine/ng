import { Pipe, PipeTransform } from '@angular/core';
import { HeaderAction } from './actions';

@Pipe({
  name: 'appendActions',
  standalone: true,
})
export class AppendActionsPipe implements PipeTransform {
  /**
   * Transform the list of action by appending a logout action at the end
   */
  transform(actions: HeaderAction[], _actions: HeaderAction[]) {
    return [...actions, ..._actions].filter(
      (action) =>
        typeof action.label !== 'undefined' &&
        action.label !== null &&
        typeof action.fn !== 'undefined' &&
        action.fn !== null
    );
  }
}


@Pipe({
  standalone: true,
  pure: true,
  name: 'asString',
})
export class AsStringPipe implements PipeTransform {
  transform(value: unknown) {
    return value as string;
  }
}

@Pipe({
  standalone: true,
  pure: true,
  name: 'array',
})
export class ArrayPipe implements PipeTransform {
  /** @description returns an empty array of the provided value is null or undefined else the array value */
  transform<T>(value: T[] | undefined | null) {
    if (typeof value === 'undefined' || value === null) {
      return [];
    }
    return value;
  }
}


/** @description Exported pipes */
export const COMMON_PIPES = [AsStringPipe, ArrayPipe, AppendActionsPipe] as const;