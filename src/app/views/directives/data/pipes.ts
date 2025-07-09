import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { memoize } from '@azlabsjs/functional';

/** @internal */
function except<T extends { [index: string]: any }>(
  values: T[],
  property: string,
  ...excepts: string[]
) {
  return values.filter((v) => {
    const item = v[property];
    return !excepts.includes(item);
  });
}

/** @internal */
const evaluate = memoize((p: unknown, exp: string) => {
  if (typeof exp === 'undefined' || exp === null) {
    return [];
  }

  exp = String(exp);
  if (exp.substring(0, 'switch:'.length) === 'switch:') {
    const d = 'switch:default';
    const statements = exp.substring('switch:'.length).split(';');
    const cache = statements.reduce((carry, current) => {
      const values = current.split('->').map((v) => v.trim());
      if (values.length === 0) {
        return carry;
      }
      if (values.length < 2) {
        carry.set(d, values[0]);
        return carry;
      }
      const [k, v] = values;
      return carry.set(k, v);
    }, new Map<string, string>());
    return cache.get(String(p)) ?? cache.get(d) ?? '';
  }
  return exp ?? [];
});

@Pipe({
  name: 'cssSwitch',
  standalone: true,
  pure: true,
})
@Injectable()
export class CssSwitch implements PipeTransform {
  transform(
    value: unknown,
    config?: string | string[] | ((...args: any) => string) | null
  ) {
    if (
      typeof config === 'function' ||
      typeof config === 'undefined' ||
      config === null
    ) {
      return config ?? [];
    }

    return Array.isArray(config)
      ? config.map((c) => evaluate(value, c ?? ''))
      : evaluate(value, config ?? '');
  }
}

@Pipe({
  name: 'except',
  standalone: true,
  pure: true,
})
export class ExceptPipe implements PipeTransform {
  transform<T extends { [index: string]: any } = any>(
    values: T[],
    property: string,
    exceptions: string[]
  ) {
    exceptions = exceptions ?? [];
    return except(values, property, ...exceptions);
  }
}

/** Exported standalone pipes */
export const DATA_PIPES = [CssSwitch, ExceptPipe] as const;
