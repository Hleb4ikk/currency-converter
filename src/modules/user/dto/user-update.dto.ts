import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsISO4217CurrencyCode, IsOptional } from 'class-validator';
import { userUpdateMetadata } from '../metadata/dto.metadata';

export class UserUpdateDto {
  @ApiProperty(userUpdateMetadata.base_currency.apiProperty)
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
  })
  @IsISO4217CurrencyCode({
    message: 'Invalid base currency code',
  })
  base_currency: string;

  @ApiProperty(userUpdateMetadata.favorites.apiProperty)
  @Transform(({ value }) => {
    return Array.isArray(value)
      ? value.map((code) =>
          typeof code === 'string' ? code.toUpperCase() : code,
        )
      : value;
  })
  @IsOptional()
  @IsArray()
  @IsISO4217CurrencyCode({
    each: true,
    message: 'Invalid currency code in favorites',
  })
  favorites: string[];
}
