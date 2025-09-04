import { RatesSuccessResponse } from '../types/ResponseData';
import { generateKeysFromConvertOptions } from 'src/modules/rates/utils/convert-options-utils';

export default function generateNotCachedEntries(
  responseData: RatesSuccessResponse,
  base_currency: string,
  notCachedRateKeys: string[],
  ttl: number,
) {
  return generateKeysFromConvertOptions(base_currency, notCachedRateKeys).map(
    (key, index) => ({
      key,
      value: responseData.rates[notCachedRateKeys[index]],
      ttl,
    }),
  );
}
