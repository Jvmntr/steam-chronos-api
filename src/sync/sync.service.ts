import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncStatusDto } from './dto/sync-status.dto';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog() {
    return await this.prisma.syncLog.create({
      data: {
        status: 'RUNNING',
        gamesFound: 0,
      },
    });
  }

  async updateLogSuccess(logId: number, gamesFound: number) {
    return await this.prisma.syncLog.update({
      where: { id: logId },
      data: {
        status: 'SUCCESS',
        gamesFound: gamesFound,
        finishedAt: new Date(),
      },
    });
  }

  async updateLogFailure(logId: number, errorMessage: string) {
    return await this.prisma.syncLog.update({
      where: { id: logId },
      data: {
        status: 'FAILURE',
        message: errorMessage,
        finishedAt: new Date(),
      },
    });
  }

  async getLatestSyncStatus(): Promise<SyncStatusDto | null> {
    return await this.prisma.syncLog.findFirst({
      orderBy: {
        startedAt: 'desc',
      },
    });
  }
}
