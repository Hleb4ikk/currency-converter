import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [ConfigModule, UserModule, CacheModule],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
