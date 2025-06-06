type ObjectType = Record<PropertyKey, unknown>;

type PickByValue<T, V> = Pick<
  // From https://stackoverflow.com/a/55153000
  T,
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>;
type ObjectEntries<T> = {
  // From https://stackoverflow.com/a/60142095
  [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]];
}[keyof T][];

function strictEntries<T extends ObjectType>(source: T): ObjectEntries<T> {
  return Object.entries(source) as ObjectEntries<T>;
}

export const StrictObject = {
  entries: strictEntries,
} as const;
