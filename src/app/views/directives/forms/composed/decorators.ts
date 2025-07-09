import { ComposedFormConfigType } from './types';

/** @internal */
function findDuplicates(array: string[]) {
  const duplicates: string[] = [];
  const frequencyMap: { [prop: string]: true } = {};

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (!frequencyMap[element]) {
      frequencyMap[element] = true;
      continue;
    }
    if (!duplicates.includes(element)) {
      duplicates.push(element);
    }
  }
  return duplicates;
}

/** Throws an exception is the composed form configuration contains duplicated property names */
export function NoDuplicate() {
  return (target: any, key: string) => {
    let state = target[key];

    Object.defineProperty(target, key, {
      set: (config: ComposedFormConfigType) => {
        const values = config.flat().map((v) => String(v.name));
        const duplicates = findDuplicates(values);
        if (duplicates.length !== 0) {
          throw new Error(
            `Configuration must not contains duplicated keys, ${duplicates.join(
              ','
            )} keys are duplicated.`
          );
        }
        state = config;
      },
      get: () => state,
    });
  };
}
