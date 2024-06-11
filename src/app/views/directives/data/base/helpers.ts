import {
  QueryStateType as QueryState,
  invalidateQuery,
  refetchQuery,
} from '@azlabsjs/rx-query';
import { FormConfigInterface } from '@azlabsjs/smart-form-core';
import { ActionsConfigType, EntityBaseType, UIActionConfigType } from '../core';
import { Observable, firstValueFrom, from, isObservable, of } from 'rxjs';

/** @description Check is value is a promise instance variable */
function isPromise(value: unknown): value is Promise<unknown> {
  return (
    typeof value === 'object' &&
    typeof (value as Promise<unknown>).then === 'function' &&
    typeof (value as Promise<unknown>).catch === 'function'
  );
}

/** @description Refresh data grid cached queries by invalidating old paged query and fetching the latest query */
export function refreshCachedQueries(
  queries: QueryState[],
  thenCallback?: (queries: QueryState[]) => void
) {
  if (queries && queries.length > 0) {
    const query = queries[0];
    // #region Q: What if we do not invalidate queries ?
    refetchQuery(query);
    const leastQueries = [...queries].slice(1);
    for (const _query of leastQueries) {
      invalidateQuery(_query);
    }
    if (thenCallback) {
      thenCallback([query]);
    }
  }
}

/** @description  Add or replace the provided query to the top of cached queries */
export function updateCachedQueries(queries: QueryState[], query: QueryState) {
  const _index = queries.findIndex((query) => query.id === query.id);
  if (_index !== -1) {
    queries.splice(_index, 1);
  }
  return [query, ...queries];
}

/** @description  This function takes a value and internally calls the {_callback} on the value. */
export async function mapIntoAsync<T = unknown, TReturn = T>(
  _value: T,
  callback: (value: T) => TReturn
) {
  const result = callback(_value) as
    | EntityBaseType
    | Observable<EntityBaseType>;
  const _observable$ = isObservable(result)
    ? (result as Observable<TReturn>)
    : isPromise(result)
    ? from(result)
    : (of(result) as Observable<TReturn>);
  return await firstValueFrom(_observable$);
}

/** @description Create form configuration from blueprint object by excluding excluded input and removing required flag on non required inputs */
export function createFormConfig(
  form: FormConfigInterface,
  excludedInputs: string[] = [],
  notRequiredInputs: string[] = []
) {
  if (excludedInputs.length === 0 && notRequiredInputs.length === 0) {
    return form;
  }

  let _form: FormConfigInterface = { ...form };
  const { controlConfigs } = _form;
  let items = [...controlConfigs];
  if (controlConfigs && controlConfigs.length > 0) {
    // Remove excluded inputs from the list of control configurations
    items = items.filter((value) => excludedInputs.indexOf(value.name) === -1);

    // Remove required flag on input if the input should not be required during update
    items = items.map((value) => {
      return {
        ...value,
        // TODO: Remove the rules definition in future release
        rules:
          notRequiredInputs.indexOf(value.name) !== -1
            ? { ...(value.rules ?? {}), isRequired: false }
            : value.rules,
        constraints:
          notRequiredInputs.indexOf(value.name) !== -1
            ? { ...(value.constraints ?? {}), required: false }
            : value.constraints,
      };
    });
    // Merge control configuration into the form object
    _form = { ..._form, controlConfigs: items };
  }
  return _form;
}

/** @description Creates a UI action configuration instance */
export function createActionConfigType(actions: ActionsConfigType) {
  const _actionConfigs: UIActionConfigType[] = [];

  for (const [name, action] of Object.entries(actions)) {
    if (typeof action === 'undefined' || action === null) {
      continue;
    }
    const { title, cssClass, position, remove, disabled } = action;

    // Push the configured action configuration
    _actionConfigs.push({
      name,
      position,
      remove,
      disabled,
      metadata: {
        title: title,
        cssClass: cssClass,
      },
    });
  }
  return _actionConfigs;
}
