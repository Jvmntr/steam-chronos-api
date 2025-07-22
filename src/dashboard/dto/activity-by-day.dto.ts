import { ApiProperty } from '@nestjs/swagger';

export class ActivityByDayDto {
  @ApiProperty({
    example: 'Sábado',
    description: 'O dia da semana.',
  })
  dayOfWeek: string;

  @ApiProperty({
    example: 15000,
    description:
      'O total de minutos jogados agregados para este dia da semana.',
  })
  totalMinutesPlayed: number;
}
