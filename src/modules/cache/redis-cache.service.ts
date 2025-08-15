import { Injectable } from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import { createKeyv as createRedisStore, Keyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';
import { KeyvEntry } from 'keyv';

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
  async get<T>(key: string) {
    return await this.store.get<T>(key);
  }

  /**
   * Returns the value of the cache for the given key.
   * @param keys Cache keys
   */
  async getMany<T>(keys: string[]) {
    return await this.store.getMany<T>(keys);
  }

  /**
   * Returns the value of the cache for the given key.
   * @param key Cache key
   * @param value Cache value
   * @param ttl Cache TTL
   */
  async set(key: string, value: any, ttl: number) {
    return await this.store.set(key, value, ttl);
  }

  /**
   * Sets the value of the cache for the given keys.
   * @param keys Cache keys
   * @param value Cache value
   * @param ttl Cache TTL
   */
  async setMany(entries: KeyvEntry[]) {
    return await this.store.setMany(entries);
  }

  /**
   * Deletes the value of the cache with the given key.
   * @param key Cache key
   */
  async delete(key: string) {
    return await this.store.delete(key);
  }
}
