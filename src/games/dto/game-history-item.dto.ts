import { ApiProperty } from '@nestjs/swagger';

export class GameHistoryItemDto {
  @ApiProperty({
    description: 'A data e hora em que o snapshot de tempo foi registrado.',
    example: '2025-07-22T03:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'O tempo total de jogo em minutos registrado naquele momento.',
    example: 5060,
  })
  valueInMinutes: number;
}
