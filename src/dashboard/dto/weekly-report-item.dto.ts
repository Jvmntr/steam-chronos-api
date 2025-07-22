import { ApiProperty } from '@nestjs/swagger';

export class WeeklyReportItemDto {
  @ApiProperty({
    example: 15,
    description: 'O ID interno do jogo no nosso banco de dados.',
  })
  gameId: number;

  @ApiProperty({
    example: 'Elden Ring',
    description: 'O nome do jogo.',
  })
  name: string;

  @ApiProperty({
    example: 1245620,
    description: 'A AppID oficial do jogo na Steam.',
  })
  appId: number;

  @ApiProperty({
    example: 450,
    description: 'Total de minutos jogados na semana especificada.',
  })
  playedTimeInMinutes: number;
}
