import { describe, expect, it } from 'vitest';
import extractCurrenciesFromResponse from './extract-currencies-from-response';
import { CurrenciesData } from '../types/ResponseData';

describe('extractCurrenciesFromResponse', () => {
  it('should return an array of currencies from response', () => {
    const currencies: CurrenciesData = {
      USD: {
        code: 'USD',
        name: 'United States Dollar',
        decimal_digits: 5,
        name_plural: 'Dollar',
        rounding: 3,
        symbol: '$',
        symbol_native: '$',
      },
      EUR: {
        code: 'EUR',
        name: 'Esposizione Universale di Roma',
        decimal_digits: 5,
        name_plural: 'Euro',
        rounding: 3,
        symbol: '€',
        symbol_native: '€',
      },
    };

    expect(extractCurrenciesFromResponse(currencies)).toEqual(['USD', 'EUR']);
  });
});
