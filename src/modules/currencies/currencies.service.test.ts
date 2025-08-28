import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrenciesService } from './currencies.service';
import { MemoryCacheService } from '../cache/memory-cache.service';
import axios from 'axios';
import extractCurrenciesFromResponse from 'src/modules/currencies/utils/extract-currencies-from-response';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

// мокаем axios
vi.mock('axios');

// мокаем extractCurrenciesFromResponse
vi.mock(
  'src/modules/currencies/utils/extract-currencies-from-response',
  () => ({
    default: vi.fn(),
  }),
);

// мокаем getDataFromConfig
vi.mock('src/utils/get-data-from-config', () => ({
  getDataFromConfig: vi.fn(),
}));

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let memoryCacheService: MemoryCacheService;
  let configService: ConfigService;

  beforeEach(() => {
    memoryCacheService = {
      get: vi.fn(),
      set: vi.fn(),
    } as any;

    configService = { get: vi.fn() } as any;

    service = new CurrenciesService(memoryCacheService, configService);

    (getDataFromConfig as any).mockReturnValue(60); // TTL по умолчанию
    vi.clearAllMocks();
  });

  it('must return currencies from cache', async () => {
    (memoryCacheService.get as any).mockResolvedValue(['USD', 'EUR']);

    const result = await service.fetchSupported();

    expect(result).toEqual(['USD', 'EUR']);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('must return currencies from api', async () => {
    (memoryCacheService.get as any).mockResolvedValue(null);

    const mockResponse = {
      data: { symbols: { USD: 'US Dollar', EUR: 'Euro' } },
    };
    (axios.get as any).mockResolvedValue(mockResponse);

    (extractCurrenciesFromResponse as any).mockReturnValue(['USD', 'EUR']);

    const result = await service.fetchSupported();

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.fxratesapi.com/currencies',
    );
    expect(extractCurrenciesFromResponse).toHaveBeenCalledWith(
      mockResponse.data,
    );
    expect(memoryCacheService.set).toHaveBeenCalledWith(
      'currencies:GET:/api/currencies',
      ['USD', 'EUR'],
      60,
    );
    expect(result).toEqual(['USD', 'EUR']);
  });

  it('must throw InternalServerErrorException ', async () => {
    (memoryCacheService.get as any).mockResolvedValue(null);
    (axios.get as any).mockRejectedValue(new Error('network error'));

    await expect(service.fetchSupported()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
