import { Transform } from 'class-transformer';
import { IsISO4217CurrencyCode, IsOptional } from 'class-validator';

export class ConvertOptionsDto {
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.toUpperCase() : undefined;
  })
  @IsISO4217CurrencyCode({
    message: 'Invalid base currency code',
  })
  base: string;

  @Transform(({ value }) => {
    return typeof value === 'string'
      ? value.split(',').map((code) => code.toUpperCase())
      : undefined;
  })
  @IsISO4217CurrencyCode({
    each: true,
    message: 'Invalid target currency code',
  })
  target: string[];
}
