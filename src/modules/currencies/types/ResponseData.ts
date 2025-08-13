import { CurrencyCode } from './CurrencyCode';

export type SupportedCodesData = {
  result: string;
  documentation: string;
  terms_of_use: string;
  supported_codes: CurrencyCode[];
};
