import { describe, expect, it } from 'vitest';
import { RatesSuccessResponse } from '../types/ResponseData';
import generateNotCachedEntries from './generate-not-cached-entries';

describe('generateNotCachedEntries', () => {
  const responseData: RatesSuccessResponse = {
    success: true,
    terms: 'https://www.fixer.io/privacy',
    privacy: 'https://www.fixer.io/privacy',
    timestamp: 1679001600000,
    date: '2023-10-23T11:51:00.000Z',
    base: 'USD',
    rates: {
      EUR: 1.15,
      GBP: 0.86,
    },
  };
  const notCachedRateKeys = ['EUR', 'GBP'];
  const base_currency = 'USD';
  const ttl = 360000;

  it('should return not cached entries', () => {
    expect(
      generateNotCachedEntries(
        responseData,
        base_currency,
        notCachedRateKeys,
        ttl,
      ),
    ).toEqual([
      { key: 'USD->EUR', value: 1.15, ttl: 360000 },
      { key: 'USD->GBP', value: 0.86, ttl: 360000 },
    ]);
  });
});
