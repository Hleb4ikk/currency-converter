import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';
import { CurrencyCode } from './types/CurrencyCode';
import { SupportedCodesData } from './types/ResponseData';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly memoryCacheService: MemoryCacheService,
    private readonly configService: ConfigService,
  ) {}

  async fetchSupported(): Promise<unknown> {
    try {
      const cached =
        await this.memoryCacheService.get<CurrencyCode[]>('api/currencies');
      if (!cached) {
        const response: AxiosResponse<SupportedCodesData> = await axios.get(
          `https://v6.exchangerate-api.com/v6/${getDataFromConfig<string>(this.configService, 'exchangeRateApiKey')}/codes`,
        );

        const currencies = response.data.supported_codes;

        await this.memoryCacheService.set(
          'api/currencies',
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
