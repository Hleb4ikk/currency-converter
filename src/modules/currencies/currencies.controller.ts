import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('api/currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of supported currencies',
    example: [
      'AFN',
      'ALL',
      'AMD',
      'ANG',
      'AOA',
      'ARS',
      'AUD',
      'AWG',
      'AZN',
      'BAM',
      'BBD',
      'BDT',
      'BGN',
      'BHD',
      'BIF',
    ],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    example: {
      message: 'Cannot fetch supported currencies',
      error: 'Internal Server Error',
      statusCode: 500,
    },
  })
  async getSupportedCurrencies() {
    return await this.currenciesService.fetchSupported();
  }
}
