/**
 * Returns a key-value Object of passed keys and values.
 * @param keys Array of keys
 * @param values Array of values
 */

export function mergeKeysAndValues<V>(
  keys: Array<string>,
  values: Array<V | undefined>,
) {
  const mergedData: Record<string, V | undefined> = {};

  for (let i = 0; i < keys.length; i++) {
    mergedData[keys[i]] = values[i];
  }

  return mergedData;
}
