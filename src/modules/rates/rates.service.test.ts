import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RatesService } from './rates.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { RedisCacheService } from '../cache/redis-cache.service';
import fetchRates from './utils/fetchRates';

vi.mock('./utils/fetchRates', () => ({
  default: vi.fn(),
}));

describe('RatesService', () => {
  let ratesService: RatesService;
  let configService: ConfigService;
  let userService: UserService;
  let redisCacheService: RedisCacheService;

  beforeEach(() => {
    configService = { get: vi.fn() } as any;
    userService = { getUserById: vi.fn() } as any;
    redisCacheService = {
      getMany: vi.fn(),
      setMany: vi.fn(),
    } as any;

    ratesService = new RatesService(
      configService,
      userService,
      redisCacheService,
    );

    vi.clearAllMocks();
  });

  it('must throw NotFoundException if user not found', async () => {
    (userService.getUserById as any).mockResolvedValue(null);

    await expect(ratesService.getRates('123', ['EUR'])).rejects.toThrow(
      NotFoundException,
    );
  });

  it('must throw BadRequestException if target is empty', async () => {
    (userService.getUserById as any).mockResolvedValue({
      base_currency: 'USD',
    });

    await expect(ratesService.getRates('123', [])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('must return only cached rates if all are in cache', async () => {
    (userService.getUserById as any).mockResolvedValue({
      base_currency: 'USD',
    });
    (redisCacheService.getMany as any).mockResolvedValue([1.15]);

    const result = await ratesService.getRates('123', ['EUR']);

    expect(result).toEqual({
      base: 'USD',
      rates: { EUR: 1.15 },
    });
    expect(fetchRates).not.toHaveBeenCalled();
  });

  it('must fetch rates from API if cache not found', async () => {
    (userService.getUserById as any).mockResolvedValue({
      base_currency: 'USD',
    });
    (redisCacheService.getMany as any).mockResolvedValue([undefined]);

    (configService.get as any).mockResolvedValue(360000);
    (fetchRates as any).mockResolvedValue({
      data: {
        success: true,
        base: 'USD',
        rates: { EUR: 1.2 },
      },
    });

    const result = await ratesService.getRates('123', ['EUR']);

    expect(result).toEqual({
      base: 'USD',
      rates: { EUR: 1.2 },
    });

    expect(redisCacheService.setMany).toHaveBeenCalled();
  });

  it('must throw InternalServerErrorException if API returned error', async () => {
    (userService.getUserById as any).mockResolvedValue({
      base_currency: 'USD',
    });
    (redisCacheService.getMany as any).mockResolvedValue([undefined]);

    (fetchRates as any).mockResolvedValue({
      data: {
        success: false,
        error: 'API_ERROR',
        description: 'Something went wrong',
      },
    });

    await expect(ratesService.getRates('123', ['EUR'])).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
