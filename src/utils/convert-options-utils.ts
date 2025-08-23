//function that generates keys for cache. It looks like key-value pair divided by '->'.
export const generateKeysFromConvertOptions = (
  base: string,
  target: string[],
): string[] => {
  return target.map((target) => `${base}->${target}`);
};
//function that extracts targets from keys.
export const extractTargetsFromConvertOptions = (keys: string[]): string[] => {
  return keys.map((key) => key.split('->')[1]);
};
