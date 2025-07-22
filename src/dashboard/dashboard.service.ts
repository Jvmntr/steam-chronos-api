import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { SummaryDto } from './dto/summary.dto';
import { ReportItemDto } from './dto/report-item.dto';
import { Prisma } from '@prisma/client';
import { ActivityByDayDto } from './dto/activity-by-day.dto';

type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getSummary(steamId: string): Promise<SummaryDto> {
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

  async getReport(
    steamId: string,
    date: string,
    period: ReportPeriod,
  ): Promise<ReportItemDto[]> {
    this.logger.log(
      `Iniciando getReport para steamId: ${steamId}, data: ${date}, período: ${period}`,
    );
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

    switch (period) {
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        throw new BadRequestException(
          'Período inválido. Use "weekly", "monthly" ou "yearly".',
        );
    }

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

    const report = gamesWithPlaytime
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

    this.logger.log(`Relatório final contém ${report.length} jogos.`);
    return report;
  }

  async getActivityByDay(steamId: string): Promise<ActivityByDayDto[]> {
    const user = await this.usersService.findUserBySteamId(steamId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result: { day_of_week: number; total_minutes_played: bigint }[] =
      await this.prisma.$queryRaw(
        Prisma.sql`
          WITH PlaytimeDiffs AS (
            SELECT
              "gameId",
              "createdAt",
              "valueInMinutes" - LAG("valueInMinutes", 1, "valueInMinutes") OVER (PARTITION BY "gameId" ORDER BY "createdAt") AS minutes_played
            FROM "PlaytimeSnapshot"
            WHERE "userId" = ${user.id}
          )
          SELECT
            EXTRACT(DOW FROM "createdAt") AS day_of_week,
            SUM(minutes_played) AS total_minutes_played
          FROM PlaytimeDiffs
          WHERE minutes_played > 0
          GROUP BY day_of_week
          ORDER BY total_minutes_played DESC;
        `,
      );

    const dayMapping = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    const formattedResult = result.map((row) => ({
      dayOfWeek: dayMapping[row.day_of_week],
      totalMinutesPlayed: Number(row.total_minutes_played),
    }));

    return formattedResult;
  }
}
