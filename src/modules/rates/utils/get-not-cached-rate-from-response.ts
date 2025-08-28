import { RatesSuccessResponse } from '../types/ResponseData';

// getting the response and notCachedRateKey(USD->EUR), returns value of current rate from response.
export default function getNotCachedRateFromResponse(
  responseData: RatesSuccessResponse,
  notCachedRateKey: string,
): number {
  console.log('in func:' + notCachedRateKey);
  return responseData.rates[notCachedRateKey];
}
