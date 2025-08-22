import { Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ConvertOptionsDto } from './dto/convert-options.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('api/rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Rates list for base currency',
    example: {
      base: 'USD',
      rates: {
        AUD: 1.5561302097,
        EUR: 0.8608201003,
        USD: 1,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: {
      message: 'User not found, even though middleware passed.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    example: {
      message: ['Invalid target currency code'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      message: 'Cannot fetch rates',
      error: 'Internal Server Error',
      statusCode: 500,
    },
  })
  @ApiQuery({
    name: 'base',
    example: 'USD',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'target',
    example: 'USD,EUR,JPY',
    description: 'Some values devided by comma',
    required: true,
    type: String,
  })
  getRates(
    @CurrentUserId() userId: string,
    @Query()
    convertOptionsDto: ConvertOptionsDto,
  ) {
    return this.ratesService.getRates(
      userId,
      convertOptionsDto.target,
      convertOptionsDto.base,
    );
  }
}
