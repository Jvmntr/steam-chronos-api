import { Module, forwardRef } from '@nestjs/common';
import { SteamService } from './steam.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [HttpModule, UsersModule, GamesModule, forwardRef(() => SyncModule)],
  providers: [SteamService],
  exports: [SteamService],
})
export class SteamModule {}
