import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { RatesResponseData } from '../types/ResponseData';
import { apiHost } from 'src/constants/currency-api.constants';

export default async function fetchRates(
  configService: ConfigService,
  base_currency: string,
  query_target: string,
): Promise<AxiosResponse<RatesResponseData>> {
  const paramsMap = new Map([
    ['api_key', configService.get('fxRatesApiKey')!],
    ['base', base_currency],
    ['currencies', query_target],
    ['resolution', '1d'],
    ['format', 'json'],
  ]);

  try {
    const urlSearchParams = new URLSearchParams();
    paramsMap.forEach((value, key) => {
      urlSearchParams.set(key, value);
    });

    return await axios.get(`${apiHost}/latest?${urlSearchParams.toString()}`);
  } catch {
    throw new InternalServerErrorException('Cannot fetch rates');
  }
}
