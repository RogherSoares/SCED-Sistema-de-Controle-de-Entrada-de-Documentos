import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Rogher Adriano' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ example: 'rogher@exemplo.com' })
  @IsEmail()
  @MaxLength(180)
  email: string;

  @ApiProperty({ example: 'SenhaForte@123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  senha: string;

  @ApiProperty({ example: 'admin', enum: ['admin', 'operador'] })
  @IsString()
  @IsIn(['admin', 'operador'])
  perfil: string;
}
