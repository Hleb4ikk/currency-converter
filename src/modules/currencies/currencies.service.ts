import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class CurrenciesService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async fetchSupported(): Promise<unknown> {
    try {
      const cached = await this.cacheManager.get('api/currencies');
      if (!cached) {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/codes`,
        );

        const currencies = response.data;

        await this.cacheManager.set('api/currencies', currencies, 3600000);
        return currencies;
      }
      return cached;
    } catch (e) {
      throw new ServiceUnavailableException(
        'Cannot fetch supported currencies',
      );
    }
  }
}
