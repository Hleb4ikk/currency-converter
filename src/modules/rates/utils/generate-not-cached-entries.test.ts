import { describe, expect, it, vi } from 'vitest';
import { RatesSuccessResponse } from '../types/ResponseData';
import generateNotCachedEntries from './generate-not-cached-entries';

vi.mock('./get-not-cached-rate-from-response');

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
    const res = generateNotCachedEntries(
      responseData,
      base_currency,
      notCachedRateKeys,
      ttl,
    );
    console.log(res);
    expect(res).toEqual([
      { key: 'USD->EUR', value: 1.15, ttl: 360000 },
      { key: 'USD->GBP', value: 0.86, ttl: 360000 },
    ]);
  });
});
