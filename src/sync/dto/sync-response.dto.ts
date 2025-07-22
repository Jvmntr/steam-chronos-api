import { ApiProperty } from '@nestjs/swagger';

export class SyncResponseDto {
  @ApiProperty({
    description: 'Uma mensagem confirmando que a tarefa foi iniciada.',
    example: 'A sincronização com a Steam foi iniciada com sucesso.',
  })
  message: string;
}
