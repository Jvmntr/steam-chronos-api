import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game as GameModel } from '@prisma/client';
import { GameHistoryItemDto } from './dto/game-history-item.dto';

interface GameData {
  appId: number;
  name: string;
}

interface PlaytimeSnapshotData {
  gameId: number;
  userId: number;
  valueInMinutes: number;
}

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateGame(gameData: GameData): Promise<GameModel> {
    return this.prisma.game.upsert({
      where: { appId: gameData.appId },
      update: { name: gameData.name },
      create: {
        appId: gameData.appId,
        name: gameData.name,
      },
    });
  }

  async createPlaytimeSnapshot(snapshotData: PlaytimeSnapshotData) {
    return this.prisma.playtimeSnapshot.create({
      data: {
        gameId: snapshotData.gameId,
        userId: snapshotData.userId,
        valueInMinutes: snapshotData.valueInMinutes,
      },
    });
  }

  async getHistoryByAppId(appId: number): Promise<GameHistoryItemDto[]> {
    const game = await this.prisma.game.findUnique({
      where: { appId },
    });

    if (!game) {
      throw new NotFoundException(`Jogo com AppID ${appId} não encontrado.`);
    }

    const history = await this.prisma.playtimeSnapshot.findMany({
      where: {
        gameId: game.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
        valueInMinutes: true,
      },
    });

    return history;
  }
}
