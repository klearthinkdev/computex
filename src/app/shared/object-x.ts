export class ObjectX extends Object {
  constructor() {
    super();
  }

  groupBy<K extends PropertyKey, T>(
    items: Array<T>,
    keySelector: (item: T, index: number) => K
  ): Partial<Record<K, T[]>> {
    return items.reduce<Partial<Record<K, T[]>>>((acc = {}, cur, i) => {
      const key = keySelector(cur, i);

      acc[key] ??= [];
      (acc[key] as Array<T>).push(cur);

      return acc;
    }, {});
  }
}
