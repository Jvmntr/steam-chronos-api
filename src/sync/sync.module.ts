import { Module, forwardRef } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SteamModule } from '../steam/steam.module';
import { SyncService } from './sync.service';

@Module({
  imports: [forwardRef(() => SteamModule)],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
