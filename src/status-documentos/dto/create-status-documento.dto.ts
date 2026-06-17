import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusDocumentoDto {
  @ApiProperty({ example: 'Recebido' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeStatus: string;
}
