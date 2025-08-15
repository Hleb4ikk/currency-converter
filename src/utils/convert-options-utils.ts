export const generateKeysFromConvertOptions = (
  base: string,
  target: string[],
): string[] => {
  return target.map((target) => `${base}->${target}`);
};

export const extractTargetsFromConvertOptions = (keys: string[]): string[] => {
  return keys.map((key) => key.split('->')[1]);
};
