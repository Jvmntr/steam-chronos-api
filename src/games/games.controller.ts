import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { GameHistoryItemDto } from './dto/game-history-item.dto';

@ApiTags('Games')
@Controller('api/games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':appId/history')
  @ApiOperation({
    summary: 'Obtém o histórico de tempo de jogo para um único jogo.',
  })
  @ApiOkResponse({
    description: 'Histórico do jogo retornado com sucesso.',
    type: [GameHistoryItemDto],
  })
  @ApiNotFoundResponse({
    description: 'Jogo com o AppID fornecido não encontrado.',
  })
  getGameHistory(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<GameHistoryItemDto[]> {
    return this.gamesService.getHistoryByAppId(appId);
  }
}
