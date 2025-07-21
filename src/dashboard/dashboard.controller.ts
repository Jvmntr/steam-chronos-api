import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@Query('steamId') steamId: string) {
    return this.dashboardService.getSummary(steamId);
  }

  @Get('weekly-report')
  getWeeklyReport(
    @Query('steamId') steamId: string,
    @Query('date') date: string,
  ) {
    const targetDate = date ? date : new Date().toISOString();
    return this.dashboardService.getWeeklyReport(steamId, targetDate);
  }
}
