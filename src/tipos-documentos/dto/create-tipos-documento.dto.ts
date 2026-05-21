import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTiposDocumentoDto {
  @ApiProperty({ example: 'Ofício' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nomeTipo: string;

  @ApiPropertyOptional({ example: 'Documento formal de comunicação.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;
}
