import { Controller, Get, Query, DefaultValuePipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { SummaryDto } from './dto/summary.dto';
import { ReportItemDto } from './dto/report-item.dto';
import { ActivityByDayDto } from './dto/activity-by-day.dto';

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
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  getSummary(@Query('steamId') steamId: string): Promise<SummaryDto> {
    return this.dashboardService.getSummary(steamId);
  }

  @Get('report')
  @ApiOperation({
    summary: 'Obtém um relatório de tempo jogado para um período específico.',
  })
  @ApiQuery({
    name: 'period',
    enum: ['weekly', 'monthly', 'yearly'],
    description: 'O período do relatório.',
  })
  @ApiOkResponse({
    description: 'Relatório retornado com sucesso.',
    type: [ReportItemDto],
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  getReport(
    @Query('steamId') steamId: string,
    @Query('date') date: string,
    @Query('period', new DefaultValuePipe('weekly'))
    period: 'weekly' | 'monthly' | 'yearly',
  ): Promise<ReportItemDto[]> {
    const targetDate = date ? date : new Date().toISOString();
    return this.dashboardService.getReport(steamId, targetDate, period);
  }

  @Get('activity-by-day')
  @ApiOperation({
    summary: 'Calcula o total de minutos jogados para cada dia da semana.',
  })
  @ApiOkResponse({
    description: 'Análise de atividade por dia retornada com sucesso.',
    type: [ActivityByDayDto],
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  getActivityByDay(
    @Query('steamId') steamId: string,
  ): Promise<ActivityByDayDto[]> {
    return this.dashboardService.getActivityByDay(steamId);
  }
}
