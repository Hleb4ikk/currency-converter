//function that merges keys and values to the Record.
export function mergeKeysAndValues<V>(
  keys: Array<string>,
  values: Array<V | undefined>,
): Map<string, V | undefined> {
  const mergedData = new Map<string, V | undefined>();

  for (let i = 0; i < keys.length; i++) {
    mergedData.set(keys[i], values[i]);
  }

  return mergedData;
}
