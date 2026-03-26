import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStatusDocumentoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeStatus: string;
}
