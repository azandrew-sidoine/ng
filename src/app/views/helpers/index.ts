/** @description Removed provided key from the list of object properties */
export function remove<T extends Record<string, unknown>>(
  _object: T,
  ...keys: (keyof T)[]
) {
  let values = { ..._object } as Omit<T, keyof T>;
  for (const prop of keys) {
    let { [prop]: _, ...v } = values;
    values = v;
  }
  return values as T & Omit<T, keyof T>;
}

/**
 * @description Check if object is empty.
 *
 * **Note** Object is empty if the object is null or undefined or all properties of the object are null, undefined of empty string
 */
export function isEmpty(value: Record<string, unknown> | null | undefined) {
  if (typeof value === 'undefined' || value === null) {
    return true;
  }

  let result = true;
  for (const prop of Object.keys(value)) {
    if (
      typeof value[prop] !== 'undefined' &&
      value[prop] !== null &&
      value[prop] !== ''
    ) {
      result = false;
      break;
    }
  }

  return result;
}

export function except<T extends { [index: string]: any }>(
  values: T[],
  property: string,
  ...excepts: string[]
) {
  return values.filter((v) => {
    const item = v[property];
    return !excepts.includes(item);
  });
}

export * from './platform';
export * from './query';
