import { Injectable } from '@nestjs/common';
import { CacheStrategy } from './cache.strategy';

import { createKeyv as createMemoryStore } from 'cacheable';
import { KeyvEntry } from 'keyv';

@Injectable()
export class MemoryCacheService implements CacheStrategy {
  private readonly store = createMemoryStore();

  async get<T>(key: string): Promise<T | undefined> {
    return await this.store.get(key);
  }
  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.store.set(key, value, ttl);
  }
  async delete(key: string): Promise<boolean> {
    return await this.store.delete(key);
  }
  async getMany<T>(keys: string[]): Promise<Array<T | undefined>> {
    return await this.store.getMany<T>(keys);
  }

  async setMany(entries: KeyvEntry[]) {
    await this.store.setMany(entries);
  }
}
