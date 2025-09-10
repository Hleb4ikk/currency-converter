import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { UserService } from '../user/user.service';
import { RatesResponseData } from './types/ResponseData';
import { mergeKeysAndValues } from 'src/utils/merge-keys-and-values';
import { RedisCacheService } from '../cache/redis-cache.service';
import fetchRates from './utils/fetchRates';

@Injectable()
export class RatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async getRates(userId: string, target: string[], base?: string) {
    let base_currency = base;
    //validation
    if (!base_currency) {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new NotFoundException(
          'User not found, even though middleware passed.',
        );
      }

      base_currency = user.base_currency;
    }

    if (target.length === 0) {
      throw new BadRequestException('Targets param is empty');
    }
    //fetching data from cache
    const cacheKeys = target.map((target) => `${base_currency}->${target}`);

    const valuesFromCache: Array<number | undefined> =
      await this.redisCacheService.getMany<number>(cacheKeys);

    const raw_cached_rates = mergeKeysAndValues<number>(
      cacheKeys.map((key) => key.split('->')[1]),
      valuesFromCache,
    );

    const cachedRates: Record<string, number> = {};
    const notCachedCurrencies: string[] = [];
    const notCachedRateKeys: string[] = [];

    raw_cached_rates.forEach((rate, currency) => {
      if (!rate) {
        notCachedCurrencies.push(currency);
        notCachedRateKeys.push(`${base_currency}->${currency}`);
      } else {
        cachedRates[currency] = rate;
      }
    });

    //caching
    if (notCachedCurrencies.length > 0) {
      const query_target = notCachedCurrencies.join(',');

      const response: AxiosResponse<RatesResponseData> = await fetchRates(
        this.configService,
        base_currency,
        query_target,
      );
      const responseData: RatesResponseData = response.data;

      if (!responseData.success) {
        throw new InternalServerErrorException(
          `fx_rate_api error: ${responseData.error}`,
          responseData.description,
        );
      }
      const ttl = this.configService.get<number>('cacheTTLs.ratesRequest')!;

      await this.redisCacheService.setMany(
        notCachedRateKeys.map((key, index) => ({
          key,
          value: responseData.rates[notCachedRateKeys[index]],
          ttl,
        })),
      );

      return {
        base: responseData.base,
        rates: {
          ...responseData.rates,
          ...cachedRates,
        },
      };
    }

    return {
      base: base_currency,
      rates: cachedRates,
    };
  }
}
