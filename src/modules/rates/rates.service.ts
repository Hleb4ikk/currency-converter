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
} from 'src/utils/convert-options-utils';
import { mergeKeysAndValues } from 'src/utils/merge-keys-and-values';
import { RedisCacheService } from '../cache/redis-cache.service';

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

    try {
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

        const response: AxiosResponse<RatesResponseData> = await axios.get(
          `https://api.fxratesapi.com/latest?api_key=${getDataFromConfig<string>(this.configService, 'fxRatesApiKey')}&base=${base_currrency}&currencies=${query_target}&resolution=1d&format=json`,
        );

        await this.redisCacheService.setMany(
          generateKeysFromConvertOptions(base_currrency, notCachedRateKeys).map(
            (key, index) => ({
              key,
              value: response.data.rates[notCachedRateKeys[index]],
              ttl: getDataFromConfig(
                this.configService,
                'cacheTTLs.ratesRequest',
              ),
            }),
          ),
        );

        return {
          base: response.data.base,
          rates: {
            ...response.data.rates,
            ...cachedRates,
          },
        };
      }

      return {
        base: base_currrency,
        rates: cachedRates,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException('Cannot fetch rates');
      }
    }
  }
}
