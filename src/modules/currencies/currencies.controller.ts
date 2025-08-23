import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { currenciesApiMetadata } from './metadata/currencies-api.metadata';

@Controller('api/currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOperation(currenciesApiMetadata.handlers.getSupportedCurrencies.operation)
  @ApiOkResponse(
    currenciesApiMetadata.handlers.getSupportedCurrencies.responses.ok,
  )
  @ApiInternalServerErrorResponse(
    currenciesApiMetadata.handlers.getSupportedCurrencies.responses
      .internalServerError,
  )
  async getSupportedCurrencies() {
    return await this.currenciesService.fetchSupported();
  }
}
