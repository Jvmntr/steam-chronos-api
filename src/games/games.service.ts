// src/games/games.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game as GameModel } from '@prisma/client'; // Importamos o tipo do Prisma

// Criamos uma interface para os dados que o serviço espera receber
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
}
