import { Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SteamService } from '../steam/steam.service';
import { SyncResponseDto } from './dto/sync-response.dto';
import { SyncService } from './sync.service';
import { SyncStatusDto } from './dto/sync-status.dto';

@ApiTags('Sync')
@Controller('api/sync')
export class SyncController {
  constructor(
    private readonly steamService: SteamService,
    private readonly syncService: SyncService,
  ) {}

  @Post('run')
  @ApiOperation({
    summary: 'Dispara manualmente a sincronização de dados com a Steam.',
  })
  @ApiResponse({
    status: 202,
    description: 'A tarefa de sincronização foi iniciada com sucesso.',
    type: SyncResponseDto,
  })
  runSync(): SyncResponseDto {
    void this.steamService.fetchDataAndSave();
    return {
      message: 'A sincronização com a Steam foi iniciada com sucesso.',
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtém o status da última sincronização.' })
  @ApiResponse({
    status: 200,
    description:
      'Status retornado com sucesso. Pode retornar nulo se nenhuma sincronização foi executada.',
    type: SyncStatusDto,
  })
  getSyncStatus(): Promise<SyncStatusDto | null> {
    return this.syncService.getLatestSyncStatus();
  }
}
