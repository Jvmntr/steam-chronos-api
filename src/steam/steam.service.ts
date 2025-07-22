import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../users/users.service';
import { GamesService } from '../games/games.service';
import { SyncService } from '../sync/sync.service';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
}

interface SteamApiResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

@Injectable()
export class SteamService {
  private readonly logger = new Logger(SteamService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly gamesService: GamesService,
    private readonly syncService: SyncService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM, {
    name: 'fetchSteamData',
    timeZone: 'America/Sao_Paulo',
  })
  async fetchDataAndSave() {
    this.logger.log('Tarefa agendada "fetchSteamData" iniciada...');
    const syncLog = await this.syncService.createLog();

    try {
      const steamId = this.configService.get<string>('STEAM_ID');
      if (!steamId) {
        throw new InternalServerErrorException(
          'STEAM_ID não encontrado no arquivo .env',
        );
      }

      const games = await this.getOwnedGames(steamId);
      if (!games || games.length === 0) {
        this.logger.warn(`Nenhum jogo encontrado para o SteamID ${steamId}.`);
        await this.syncService.updateLogSuccess(syncLog.id, 0);
        return;
      }

      this.logger.log(`Encontrados ${games.length} jogos. Salvando dados...`);
      await this.saveGamesData(games, steamId);

      await this.syncService.updateLogSuccess(syncLog.id, games.length);
      this.logger.log('Tarefa agendada finalizada com sucesso!');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      await this.syncService.updateLogFailure(syncLog.id, errorMessage);

      if (error instanceof Error) {
        this.logger.error(
          `Ocorreu uma falha na tarefa agendada: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          'Ocorreu uma falha desconhecida na tarefa agendada.',
          error,
        );
      }
    }
  }

  private async getOwnedGames(steamId: string): Promise<SteamGame[]> {
    const apiKey = this.configService.get<string>('STEAM_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'STEAM_API_KEY não encontrada no arquivo .env',
      );
    }

    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true`;

    const response = await firstValueFrom(
      this.httpService.get<SteamApiResponse>(url),
    );
    return response.data.response.games;
  }

  private async saveGamesData(games: SteamGame[], steamId: string) {
    const user = await this.usersService.findOrCreateUserBySteamId(steamId);

    this.logger.log(`Iniciando processamento de ${games.length} jogos...`);
    for (const [index, game] of games.entries()) {
      this.logger.debug(
        `[${index + 1}/${games.length}] Processando: ${game.name} (AppID: ${
          game.appid
        })`,
      );

      const dbGame = await this.gamesService.findOrCreateGame({
        appId: game.appid,
        name: game.name,
      });

      await this.gamesService.createPlaytimeSnapshot({
        gameId: dbGame.id,
        userId: user.id,
        valueInMinutes: game.playtime_forever,
      });
    }
  }
}
