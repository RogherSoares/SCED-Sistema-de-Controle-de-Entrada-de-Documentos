import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDto {
  @ApiProperty({ example: 'rogher@exemplo.com' })
  @IsEmail()
  @MaxLength(180)
  email: string;

  @ApiProperty({ example: 'SenhaForte@123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  senha: string;
}
