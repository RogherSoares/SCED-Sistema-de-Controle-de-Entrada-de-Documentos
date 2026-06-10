import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TwoFactorCodeEntity } from '../auth/entities/two-factor-code.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuarioEntity } from './entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioEntity,
      TwoFactorCodeEntity,
    ]),
    AuthModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}