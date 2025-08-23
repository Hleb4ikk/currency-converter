//function that merges keys and values to the Record.
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
