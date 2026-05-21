import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistoricoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idDocumento: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  idStatus: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idUsuario: number;

  @ApiPropertyOptional({ example: '2026-05-20T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dataMovimentacao?: string;

  @ApiPropertyOptional({
    example: 'Documento encaminhado para setor responsável.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observacao?: string;
}
