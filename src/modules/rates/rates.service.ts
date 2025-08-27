import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { getDataFromConfig } from 'src/utils/get-data-from-config';
import { UserService } from '../user/user.service';
import { RatesResponseData } from './types/ResponseData';
import {
  extractTargetsFromConvertOptions,
  generateKeysFromConvertOptions,
} from 'src/modules/rates/utils/convert-options-utils';
import { mergeKeysAndValues } from 'src/utils/merge-keys-and-values';
import { RedisCacheService } from '../cache/redis-cache.service';
import generateNotCachedEntries from './utils/generate-not-cached-entries';

@Injectable()
export class RatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async getRates(userId: string, target: string[], base?: string) {
    let base_currrency = base;
    // 1. check if base is provided
    if (!base_currrency) {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new NotFoundException(
          'User not found, even though middleware passed.',
        );
      }

      base_currrency = user.base_currency;
    }
    // 2. check if target is not empty
    if (target.length === 0) {
      throw new BadRequestException('Targets param is empty');
    }

    // 3. generate keys like USD->EUR, USD->GBP
    const cacheKeys = generateKeysFromConvertOptions(base_currrency, target);

    // 4. get values from cache by keys from 3 point
    const valuesFromCache: Array<number | undefined> =
      await this.redisCacheService.getMany<number>(cacheKeys);

    // 5. merge keys and values to the Record like {USD->EUR: 1.15, USD->GBP: 0.86}.
    // if value is undefined, it means that rate is not cached and be USD->JPY: undefined.
    const raw_cached_rates = mergeKeysAndValues<number>(
      extractTargetsFromConvertOptions(cacheKeys),
      valuesFromCache,
    );

    const cachedRates: Record<string, number> = {};

    // 6. from raw data get only rates that are not undefined.
    for (const currency in raw_cached_rates) {
      if (raw_cached_rates[currency]) {
        cachedRates[currency] = raw_cached_rates[currency];
      }
    }
    // 7. Getting not cached rates. If they are undefined
    const notCachedRateKeys = Object.keys(raw_cached_rates).filter(
      (key) => !raw_cached_rates[key],
    );
    console.log(notCachedRateKeys);
    // 8. If we have not cached rates, we need to fetch them from API.
    if (notCachedRateKeys.length > 0) {
      const query_target = notCachedRateKeys.join(',');

      let response: AxiosResponse<RatesResponseData>;

      try {
        response = await axios.get(
          `https://api.fxratesapi.com/latest?api_key=${getDataFromConfig<string>(this.configService, 'fxRatesApiKey')}&base=${base_currrency}&currencies=${query_target}&resolution=1d&format=json`,
        );
      } catch {
        throw new InternalServerErrorException('Cannot fetch rates');
      }
      const responseData: RatesResponseData = response.data;

      if (!responseData.success) {
        throw new InternalServerErrorException(
          `fx_rate_api error: ${responseData.error}`,
          responseData.description,
        );
      } else {
        //9. Cache not cached rates.
        await this.redisCacheService.setMany(
          generateNotCachedEntries(
            responseData,
            base_currrency,
            notCachedRateKeys,
            getDataFromConfig(this.configService, 'cacheTTLs.ratesRequest'),
          ),
        );
      }
      // 10. return cached and not cached rates.
      return {
        base: responseData.base,
        rates: {
          ...responseData.rates,
          ...cachedRates,
        },
      };
    }
    //11. return cached rates if point 8 is not reached.
    return {
      base: base_currrency,
      rates: cachedRates,
    };
  }
}
