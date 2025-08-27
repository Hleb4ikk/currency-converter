import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(() => {
    // мок prisma
    prisma = {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    } as any;

    userService = new UserService(prisma);
  });

  // --- createUser ---
  it('createUser -> must return created user', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (prisma.user.create as any).mockResolvedValue(mockUser);

    const result = await userService.createUser();

    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({ data: {} });
  });

  it('createUser -> must throw the InternalServerErrorException', async () => {
    (prisma.user.create as any).mockRejectedValue(new Error('db error'));

    await expect(userService.createUser()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  // --- getUserById ---
  it('getUserById -> must return user', async () => {
    const mockUser = { id: '2', email: 'user@test.com' };
    (prisma.user.findUnique as any).mockResolvedValue(mockUser);

    const result = await userService.getUserById('2');

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '2' },
    });
  });

  it('getUserById -> must throw the InternalServerErrorException', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('db error'));

    await expect(userService.getUserById('2')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  // --- updateUser ---
  it('updateUser -> должен вернуть обновленного пользователя', async () => {
    const mockUser = {
      id: '3',
      base_currency: 'USD',
      favorites: ['USD', 'EUR'],
    };
    (prisma.user.update as any).mockResolvedValue(mockUser);

    const result = await userService.updateUser('3', {
      base_currency: 'USD',
      favorites: ['USD', 'EUR'],
    });

    expect(result).toEqual(mockUser);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '3' },
      data: { base_currency: 'USD', favorites: ['USD', 'EUR'] },
    });
  });

  it('updateUser -> must throw the InternalServerErrorException', async () => {
    (prisma.user.update as any).mockRejectedValue(new Error('db error'));

    await expect(
      userService.updateUser('3', {
        base_currency: 'USD',
        favorites: ['USD', 'EUR'],
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
