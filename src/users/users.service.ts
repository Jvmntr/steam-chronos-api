import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUserBySteamId(steamId: string) {
    const user = await this.prisma.user.upsert({
      where: { steamId: steamId },
      update: {},
      create: { steamId: steamId },
    });
    return user;
  }

  async findUserBySteamId(steamId: string) {
    return this.prisma.user.findUnique({
      where: { steamId },
    });
  }
}
