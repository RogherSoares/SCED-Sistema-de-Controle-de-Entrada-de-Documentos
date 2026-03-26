import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome: string;

  @IsEmail()
  @MaxLength(180)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  senha: string;

  @IsString()
  @IsIn(['admin', 'operador'])
  perfil: string;
}
