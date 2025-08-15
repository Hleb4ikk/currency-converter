export type RatesResponseData = {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
};
