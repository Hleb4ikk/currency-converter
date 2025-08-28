import { describe, expect, it } from 'vitest';
import { RatesSuccessResponse } from '../types/ResponseData';
import getNotCachedRateFromResponse from './get-not-cached-rate-from-response';

describe('getNotCachedRateFromResponse', () => {
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
  const key = 'GBP';
  it('must return value by key from response, it must be a number', () => {
    expect(getNotCachedRateFromResponse(responseData, key)).toBe(0.86);
  });
});
