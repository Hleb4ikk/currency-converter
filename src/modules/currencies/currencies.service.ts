import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';
import { CurrenciesData } from './types/ResponseData';
import extractCurrenciesFromResponse from 'src/utils/extract-currencies-from-response';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly memoryCacheService: MemoryCacheService,
    private readonly configService: ConfigService,
  ) {}

  async fetchSupported(): Promise<string[]> {
    try {
      const cached = await this.memoryCacheService.get<string[]>(
        'currencies:GET:/api/currencies',
      );
      if (!cached) {
        const response: AxiosResponse<CurrenciesData> = await axios.get(
          `https://api.fxratesapi.com/currencies`,
        );

        const currencies = extractCurrenciesFromResponse(response.data);

        await this.memoryCacheService.set(
          'currencies:GET:/api/currencies',
          currencies,
          getDataFromConfig(this.configService, 'cacheTTLs.currenciesRequest'),
        );
        return currencies;
      }

      return cached;
    } catch {
      throw new ServiceUnavailableException(
        'Cannot fetch supported currencies',
      );
    }
  }
}
