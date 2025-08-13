import { IsArray, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  base_currency: string;

  @IsArray()
  @IsOptional()
  favorites: string[];
}
