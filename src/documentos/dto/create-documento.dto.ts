import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentoDto {
  @ApiProperty({ example: '2026.0001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  protocolo: string;

  @ApiProperty({ example: 'Secretaria Municipal de Educação' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  remetente: string;

  @ApiPropertyOptional({ example: 'Documento para análise de protocolo.' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: '/uploads/arquivo.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  arquivoUrl?: string;

  @ApiProperty({ example: '2026-05-20' })
  @IsDateString()
  dataEntrada: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idTipo: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idStatus: number;
}
