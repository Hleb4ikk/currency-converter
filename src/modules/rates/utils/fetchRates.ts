import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { RatesResponseData } from '../types/ResponseData';

export default async function fetchRates(
  configService: ConfigService,
  base_currency: string,
  query_target: string,
): Promise<AxiosResponse<RatesResponseData>> {
  try {
    return await axios.get(
      `https://api.fxratesapi.com/latest?api_key=${configService.get('fxRatesApiKey')!}&base=${base_currency}&currencies=${query_target}&resolution=1d&format=json`,
    );
  } catch {
    throw new InternalServerErrorException('Cannot fetch rates');
  }
}
