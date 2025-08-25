import { CurrenciesData } from 'src/modules/currencies/types/ResponseData';

//function that returns an array of currencies from response.
export default function extractCurrenciesFromResponse(
  currencies: CurrenciesData,
): string[] {
  const result: string[] = [];

  for (const currency in currencies) {
    result.push(currency);
  }

  return result;
}
