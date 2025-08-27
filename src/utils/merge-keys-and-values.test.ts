import { describe, expect, it } from 'vitest';
import { mergeKeysAndValues } from './merge-keys-and-values';

describe('mergeKeysAndValues', () => {
  it('should return Record<string, V>. V - is type of values array. ', () => {
    const keys = ['key1', 'key2', 'key3'];
    const values = [1, 2, 3];

    expect(mergeKeysAndValues(keys, values)).toEqual({
      key1: 1,
      key2: 2,
      key3: 3,
    });
  });
});
