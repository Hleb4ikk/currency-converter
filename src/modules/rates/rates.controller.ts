import { Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ConvertOptionsDto } from './dto/convert-options.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ratesApiMetadata } from './metadata/rates-api.metadata';

@Controller('api/rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOperation(ratesApiMetadata.handlers.getRates.operation)
  @ApiOkResponse(ratesApiMetadata.handlers.getRates.responses.ok)
  @ApiNotFoundResponse(ratesApiMetadata.handlers.getRates.responses.notFound)
  @ApiBadRequestResponse(
    ratesApiMetadata.handlers.getRates.responses.badRequest,
  )
  @ApiInternalServerErrorResponse(
    ratesApiMetadata.handlers.getRates.responses.internalServerError,
  )
  @ApiQuery(ratesApiMetadata.handlers.getRates.queries.base)
  @ApiQuery(ratesApiMetadata.handlers.getRates.queries.target)
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
