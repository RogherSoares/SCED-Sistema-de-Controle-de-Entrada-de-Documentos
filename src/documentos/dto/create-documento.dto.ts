import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDocumentoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  protocolo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  remetente: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  arquivoUrl?: string;

  @IsDateString()
  dataEntrada: string;

  @IsInt()
  idTipo: number;

  @IsInt()
  idStatus: number;
}
