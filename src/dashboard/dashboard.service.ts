import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getSummary(steamId: string) {
    const user = await this.usersService.findUserBySteamId(steamId);
    if (!user) {
      throw new NotFoundException(
        'Usuário com o SteamID fornecido não encontrado.',
      );
    }

    const totalGames = await this.prisma.game.count({
      where: { snapshots: { some: { userId: user.id } } },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPlaytime = await this.prisma.playtimeSnapshot.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { valueInMinutes: 'desc' },
      take: 1,
      include: { game: true },
    });

    return {
      totalGames: totalGames,
      mostPlayedLastWeek:
        recentPlaytime[0]?.game.name || 'Nenhum jogo jogado recentemente',
    };
  }

  async getWeeklyReport(steamId: string, date: string) {
    this.logger.log(`Iniciando getWeeklyReport para steamId: ${steamId}...`);
    if (!date) {
      throw new BadRequestException('A data é um parâmetro obrigatório.');
    }

    const user = await this.usersService.findUserBySteamId(steamId);
    if (!user) {
      throw new NotFoundException(
        'Usuário com o SteamID fornecido não encontrado.',
      );
    }

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    this.logger.debug(
      `Buscando relatório para o período de ${startDate.toISOString()} a ${endDate.toISOString()}`,
    );

    const gamesWithPlaytime = await this.prisma.game.findMany({
      where: {
        snapshots: {
          some: {
            userId: user.id,
            createdAt: { gte: startDate, lte: endDate },
          },
        },
      },
      select: {
        id: true,
        name: true,
        appId: true,
        snapshots: {
          where: {
            userId: user.id,
            createdAt: { gte: startDate, lte: endDate },
          },
          orderBy: { createdAt: 'asc' },
          select: { valueInMinutes: true, createdAt: true },
        },
      },
    });

    this.logger.debug(
      `Prisma encontrou ${gamesWithPlaytime.length} jogos com snapshots no período.`,
    );

    const weeklyReport = gamesWithPlaytime
      .map((game) => {
        if (game.snapshots.length < 2) return null;
        const firstSnapshot = game.snapshots[0].valueInMinutes;
        const lastSnapshot =
          game.snapshots[game.snapshots.length - 1].valueInMinutes;
        const playedTime = lastSnapshot - firstSnapshot;
        return {
          gameId: game.id,
          name: game.name,
          appId: game.appId,
          playedTimeInMinutes: playedTime,
        };
      })
      .filter((game) => game && game.playedTimeInMinutes > 0)
      .sort((a, b) => b.playedTimeInMinutes - a.playedTimeInMinutes);

    this.logger.log(`Relatório final contém ${weeklyReport.length} jogos.`);
    return weeklyReport;
  }
}
