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
  try {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('api_key', configService.get('fxRatesApiKey')!);
    urlSearchParams.set('base', base_currency);
    urlSearchParams.set('currencies', query_target);
    urlSearchParams.set('resolution', '1d');
    urlSearchParams.set('format', 'json');

    return await axios.get(`${apiHost}/latest?${urlSearchParams.toString()}`);
  } catch {
    throw new InternalServerErrorException('Cannot fetch rates');
  }
}
