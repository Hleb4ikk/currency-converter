import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemoryCacheService } from '../cache/memory-cache.service';
import { ConfigService } from '@nestjs/config';
import fetchCurrencies from './utils/fetchCurrencies';

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
        const response = await fetchCurrencies();

        const currencies = Object.keys(response.data);

        await this.memoryCacheService.set(
          'currencies:GET:/api/currencies',
          currencies,
          this.configService.get('cacheTTLs.currenciesRequest')!,
        );
        return currencies;
      }

      return cached;
    } catch {
      throw new InternalServerErrorException(
        'Cannot fetch supported currencies',
      );
    }
  }
}
