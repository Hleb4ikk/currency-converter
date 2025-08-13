import { Injectable } from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import { createKeyv as createRedisStore, Keyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

@Injectable()
export class RedisCacheService implements CacheStrategy {
  private readonly store: Keyv;

  constructor(private readonly configService: ConfigService) {
    this.store = createRedisStore(
      getDataFromConfig(this.configService, 'redis.url'),
    );
  }

  /**
   * Returns the value of the cache for the given key.
   * @param key Cache key
   */
  async get<T>(key: string): Promise<T | undefined> {
    return await this.store.get(key);
  }

  /**
   * Returns the value of the cache for the given key.
   * @param key Cache key
   * @param value Cache value
   * @param ttl Cache TTL
   */
  async set(key: string, value: any, ttl: number): Promise<boolean> {
    return await this.store.set(key, value, ttl);
  }

  /**
   * Deletes the value of the cache with the given key.
   * @param key Cache key
   */
  async delete(key: string): Promise<boolean> {
    return await this.store.delete(key);
  }
}
