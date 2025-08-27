import { describe, expect, it } from 'vitest';
import {
  extractTargetsFromConvertOptions,
  generateKeysFromConvertOptions,
} from './convert-options-utils';

describe('generateKeysFromConvertOptions', () => {
  it('should return cache keys array like USD->EUR', () => {
    const base = 'USD';
    const target = ['EUR', 'GBP'];

    expect(generateKeysFromConvertOptions(base, target)).toEqual([
      'USD->EUR',
      'USD->GBP',
    ]);
  });
});

describe('extractTargetsFromConvertOptions', () => {
  it('should return targets array like EUR, GBP', () => {
    const keys = ['USD->EUR', 'USD->GBP'];

    expect(extractTargetsFromConvertOptions(keys)).toEqual(['EUR', 'GBP']);
  });
});
