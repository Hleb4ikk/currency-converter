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

    if (!base_currrency) {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        throw new NotFoundException(
          'User not found, even though middleware passed.',
        );
      }

      base_currrency = user.base_currency;
    }

    if (target.length === 0) {
      throw new BadRequestException('Targets param is empty');
    }

    const cacheKeys = generateKeysFromConvertOptions(base_currrency, target);

    const valuesFromCache: Array<number | undefined> =
      await this.redisCacheService.getMany<number>(cacheKeys);

    const rates = mergeKeysAndValues<number>(
      extractTargetsFromConvertOptions(cacheKeys),
      valuesFromCache,
    );

    const cachedRates: Record<string, number> = {};

    for (const currency in rates) {
      if (rates[currency]) {
        cachedRates[currency] = rates[currency];
      }
    }

    const notCachedRateKeys = Object.keys(rates).filter((key) => !rates[key]);

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
        await this.redisCacheService.setMany(
          generateNotCachedEntries(
            responseData,
            base_currrency,
            notCachedRateKeys,
            getDataFromConfig(this.configService, 'cacheTTLs.ratesRequest'),
          ),
        );
      }
      return {
        base: responseData.base,
        rates: {
          ...responseData.rates,
          ...cachedRates,
        },
      };
    }

    return {
      base: base_currrency,
      rates: cachedRates,
    };
  }
}
