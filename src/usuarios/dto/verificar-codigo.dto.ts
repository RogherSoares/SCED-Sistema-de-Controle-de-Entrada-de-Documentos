import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class VerificarCodigoDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O identificador do usuário deve ser um número.' })
  usuarioId: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'O código é obrigatório.' })
  @Length(6, 6, {
    message: 'O código deve possuir exatamente 6 números.',
  })
  @Matches(/^\d{6}$/, {
    message: 'O código deve possuir apenas números.',
  })
  codigo: string;
}