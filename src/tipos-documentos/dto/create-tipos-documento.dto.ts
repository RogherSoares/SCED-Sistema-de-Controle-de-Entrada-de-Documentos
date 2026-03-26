import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTiposDocumentoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nomeTipo: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;
}
