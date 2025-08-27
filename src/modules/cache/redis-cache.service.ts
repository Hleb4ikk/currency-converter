import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import Keyv, { KeyvEntry } from 'keyv';
import KeyvRedis, { createKeyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

@Injectable()
export class RedisCacheService
  implements CacheStrategy, OnModuleInit, OnModuleDestroy
{
  private readonly store: Keyv<string>;
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(private readonly configService: ConfigService) {
    const redisUrl = getDataFromConfig<string>(this.configService, 'redis.url');

    this.store = createKeyv(redisUrl) as Keyv<string>;
  }

  onModuleInit() {
    const client = (this.store.opts.store as KeyvRedis<string>).client;

    client.on('reconnecting', () => {
      this.logger.log('Trying to reconnect to Redis...');
    });

    client.on('connect', () => {
      this.logger.log('Redis is connected.');
    });

    client.on('error', (err: Error) => {
      this.logger.error(
        `Redis connection error${err.message ? `: ${err.message}` : '.'}`,
        err.stack,
      );
      if (err.message === 'Socket closed unexpectedly') {
        client.destroy();
      }
    });

    client.on('end', () => {
      this.logger.log('Redis connection closed.');
    });
  }

  async onModuleDestroy() {
    const client = (this.store.opts.store as KeyvRedis<string>).client;
    if (client.isOpen) {
      await client.destroy();
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.store.get<T>(key);
  }

  async getMany<T>(keys: string[]): Promise<(T | undefined)[]> {
    return await this.store.getMany<T>(keys);
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await this.store.set(key, value, ttlSeconds * 1000);
  }

  async setMany(entries: KeyvEntry[]): Promise<void> {
    await this.store.setMany(entries);
  }

  async delete(key: string): Promise<boolean> {
    return await this.store.delete(key);
  }
}
