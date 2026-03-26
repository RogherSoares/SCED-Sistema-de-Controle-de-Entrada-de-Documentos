import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHistoricoDto {
  @IsInt()
  idDocumento: number;

  @IsInt()
  idStatus: number;

  @IsInt()
  idUsuario: number;

  @IsOptional()
  @IsDateString()
  dataMovimentacao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observacao?: string;
}
