import { ApiProperty } from '@nestjs/swagger';

export class SyncStatusDto {
  @ApiProperty({ example: 1, description: 'O ID do registro de log.' })
  id: number;

  @ApiProperty({
    example: 'SUCCESS',
    description: 'O status da sincronização: RUNNING, SUCCESS, ou FAILURE.',
  })
  status: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: null,
    description: 'A mensagem de erro, caso a sincronização tenha falhado.',
  })
  message: string | null;

  @ApiProperty({
    example: 350,
    description: 'O número de jogos encontrados na execução.',
  })
  gamesFound: number;

  @ApiProperty({
    description: 'A data e hora em que a sincronização começou.',
  })
  startedAt: Date;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'A data e hora em que a sincronização terminou.',
  })
  finishedAt: Date | null;
}
