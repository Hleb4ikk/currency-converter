export type RatesResponseData = RatesSuccessResponse | RatesFailedResponse;

export type RatesSuccessResponse = {
  success: true;
  terms: string;
  privacy: string;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
};

export type RatesFailedResponse = {
  success: false;
  error: string;
  description: string;
};
