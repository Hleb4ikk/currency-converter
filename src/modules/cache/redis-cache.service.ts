import { Injectable } from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import { createKeyv as createRedisStore } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { getDataFromConfig } from 'src/utils/get-data-from-config';
import Keyv, { KeyvEntry } from 'keyv';

@Injectable()
export class RedisCacheService implements CacheStrategy {
  private readonly store: Keyv;

  constructor(private readonly configService: ConfigService) {
    this.store = createRedisStore(
      getDataFromConfig(this.configService, 'redis.url'),
    );
  }

  async get<T>(key: string) {
    return await this.store.get<T>(key);
  }

  async getMany<T>(keys: string[]) {
    return await this.store.getMany<T>(keys);
  }

  async set(key: string, value: any, ttl: number) {
    return await this.store.set(key, value, ttl);
  }

  async setMany(entries: KeyvEntry[]) {
    return await this.store.setMany(entries);
  }

  async delete(key: string) {
    return await this.store.delete(key);
  }
}
