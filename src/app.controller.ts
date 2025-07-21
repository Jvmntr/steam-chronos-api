import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SteamService } from './steam/steam.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly steamService: SteamService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-steam')
  testSteam() {
    void this.steamService.fetchDataAndSave();
    return 'Busca de dados da Steam iniciada! Verifique os logs do console e seu banco de dados.';
  }
}
