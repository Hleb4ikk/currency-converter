import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { CacheModule } from '../cache/cache.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CacheModule, ConfigModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
