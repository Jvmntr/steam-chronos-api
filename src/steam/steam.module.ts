import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [HttpModule, UsersModule, GamesModule],
  providers: [SteamService],
  exports: [SteamService],
})
export class SteamModule {}
