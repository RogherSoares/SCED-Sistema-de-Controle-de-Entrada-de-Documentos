import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { DocumentoEntity } from './entities/documento.entity';
import { TiposDocumentoEntity } from '../tipos-documentos/entities/tipos-documento.entity';
import { StatusDocumentoEntity } from '../status-documentos/entities/status-documento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentoEntity,
      TiposDocumentoEntity,
      StatusDocumentoEntity,
    ]),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService],
})
export class DocumentosModule {}
