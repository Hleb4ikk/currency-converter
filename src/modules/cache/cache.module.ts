import { Module } from '@nestjs/common';
import { MemoryCacheService } from './memory-cache.service';
import { RedisCacheService } from './redis-cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MemoryCacheService, RedisCacheService],
  exports: [MemoryCacheService, RedisCacheService],
})
export class CacheModule {}
