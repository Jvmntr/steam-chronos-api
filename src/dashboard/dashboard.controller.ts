import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { WeeklyReportItemDto } from './dto/weekly-report-item.dto';
import { SummaryDto } from './dto/summary.dto';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obtém um resumo geral da atividade do usuário.' })
  @ApiOkResponse({
    description: 'Resumo retornado com sucesso.',
    type: SummaryDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário com o SteamID fornecido não encontrado.',
  })
  getSummary(@Query('steamId') steamId: string): Promise<SummaryDto> {
    return this.dashboardService.getSummary(steamId);
  }

  @Get('weekly-report')
  @ApiOperation({
    summary:
      'Obtém um relatório de tempo jogado por jogo para uma semana específica.',
  })
  @ApiOkResponse({
    description: 'Relatório semanal retornado com sucesso.',
    type: [WeeklyReportItemDto],
  })
  @ApiNotFoundResponse({
    description: 'Usuário com o SteamID fornecido não encontrado.',
  })
  getWeeklyReport(
    @Query('steamId') steamId: string,
    @Query('date') date: string,
  ): Promise<WeeklyReportItemDto[]> {
    const targetDate = date ? date : new Date().toISOString();
    return this.dashboardService.getWeeklyReport(steamId, targetDate);
  }
}
