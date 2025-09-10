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
    const cacheKey = this.fetchSupported.name;
    try {
      const cached = await this.memoryCacheService.get<string[]>(cacheKey);
      if (!cached) {
        const response = await fetchCurrencies();

        const currencies = Object.keys(response.data);

        await this.memoryCacheService.set(
          cacheKey,
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
