import { QueryResultType } from './builder';

/** @description Query result factory function type definition */
export function createQueryResult(response: any, k?: string) {
  const _items =
    k && k in response ? response[k] : (response as Record<string, unknown>[]);
  return {
    items: _items,
    all: () => _items,
    first: () => (_items.length > 0 ? _items[0] : null),
    count: () => _items.length,
  } as QueryResultType<Record<string, unknown>>;
}
