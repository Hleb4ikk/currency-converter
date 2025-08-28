import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetchRates from './fetchRates';

import axios from 'axios';
vi.mock('axios');

import { getDataFromConfig } from 'src/utils/get-data-from-config';
vi.mock('src/utils/get-data-from-config', () => ({
  getDataFromConfig: vi.fn(),
}));

describe('fetchRates', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = { get: vi.fn() } as any;
    (getDataFromConfig as any).mockReturnValue('TEST_API_KEY');
    vi.clearAllMocks();
  });

  it('must call axios.get with correct URL', async () => {
    const mockResponse = {
      data: {
        success: true,
        base: 'USD',
        rates: { EUR: 1.2 },
      } as any,
    };
    (axios.get as any).mockResolvedValue(mockResponse);

    const result = await fetchRates(configService, 'USD', 'EUR,GBP');

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.fxratesapi.com/latest?api_key=TEST_API_KEY&base=USD&currencies=EUR,GBP&resolution=1d&format=json',
    );
    expect(result).toEqual(mockResponse);
  });

  it('must throw InternalServerErrorException, if axios response threw the exception', async () => {
    (axios.get as any).mockRejectedValue(new Error('network error'));

    await expect(fetchRates(configService, 'USD', 'EUR')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
