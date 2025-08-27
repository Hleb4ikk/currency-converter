import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDataFromConfig } from './get-data-from-config';
import { ConfigService } from '@nestjs/config';

describe('getDataFromConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = { get: vi.fn() } as any;
  });

  it('should return data from config', () => {
    (configService.get as any).mockReturnValue(1);
    expect(getDataFromConfig(configService, 'test')).toBe(1);
  });

  it('should throw an error if config is not set', () => {
    (configService.get as any).mockReturnValue(undefined);
    expect(() => getDataFromConfig(configService, 'throwable')).toThrowError(
      'Config throwable is not set',
    );
  });
});
