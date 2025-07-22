import { ApiProperty } from '@nestjs/swagger';

export class SummaryDto {
  @ApiProperty({
    example: 450,
    description: 'O número total de jogos rastreados na biblioteca do usuário.',
  })
  totalGames: number;

  @ApiProperty({
    example: 'Elden Ring',
    description:
      'O nome do jogo com o maior tempo registrado na última semana.',
  })
  mostPlayedLastWeek: string;
}
