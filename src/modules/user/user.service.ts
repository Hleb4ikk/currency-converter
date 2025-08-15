import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(): Promise<User> {
    try {
      return await this.prisma.user.create({ data: {} });
    } catch {
      throw new Error('Error creating user');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async updateUser(
    userId: string,
    user: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: user,
    });
  }
}
