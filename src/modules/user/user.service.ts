import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    user: Omit<Prisma.UserCreateInput, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<User> {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (e) {
      throw new Error('Error creating user');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
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
