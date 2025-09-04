import axios, { AxiosResponse } from 'axios';
import { CurrenciesData } from '../types/ResponseData';

export default async function fetchCurrencies(): Promise<
  AxiosResponse<CurrenciesData>
> {
  return await axios.get(`https://api.fxratesapi.com/currencies`);
}
