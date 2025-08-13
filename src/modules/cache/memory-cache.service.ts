import { Injectable } from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import { createKeyv as createMemoryStore } from 'cacheable';

@Injectable()
export class MemoryCacheService implements CacheStrategy {
  private readonly store = createMemoryStore();

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
