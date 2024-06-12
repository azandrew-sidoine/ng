import { QueryResultType } from './builder';

/** @description Query result factory function type definition */
export function createQueryResult(result: any) {
  const _items =
    'data' in result ? result['data'] : (result as Record<string, unknown>[]);
  return {
    items: _items,
    all: () => _items,
    first: () => (_items.length > 0 ? _items[0] : null),
    count: () => _items.length,
  } as QueryResultType<Record<string, unknown>>;
}
