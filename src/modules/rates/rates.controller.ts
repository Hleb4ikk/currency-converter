import { Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { ConvertOptionsDto } from './dto/convert-options.dto';

@Controller('api/rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
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
