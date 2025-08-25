import { KeyvEntry } from 'keyv';

export interface CacheStrategy {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  getMany<T>(keys: string[]): Promise<Array<T | undefined>>;
  setMany(entries: KeyvEntry[]): Promise<void>;
}
