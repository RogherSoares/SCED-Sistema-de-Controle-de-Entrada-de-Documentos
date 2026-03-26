import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  @MaxLength(180)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  senha: string;
}
