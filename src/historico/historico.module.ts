import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoService } from './historico.service';
import { HistoricoController } from './historico.controller';
import { HistoricoEntity } from './entities/historico.entity';
import { DocumentoEntity } from '../documentos/entities/documento.entity';
import { StatusDocumentoEntity } from '../status-documentos/entities/status-documento.entity';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoricoEntity,
      DocumentoEntity,
      StatusDocumentoEntity,
      UsuarioEntity,
    ]),
  ],
  controllers: [HistoricoController],
  providers: [HistoricoService],
  exports: [HistoricoService],
})
export class HistoricoModule {}
