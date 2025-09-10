import axios, { AxiosResponse } from 'axios';
import { CurrenciesData } from '../types/ResponseData';
import { apiHost } from 'src/constants/currency-api.constants';

export default async function fetchCurrencies(): Promise<
  AxiosResponse<CurrenciesData>
> {
  return await axios.get(`${apiHost}/currencies`);
}
