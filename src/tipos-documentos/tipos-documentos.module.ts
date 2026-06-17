import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposDocumentosService } from './tipos-documentos.service';
import { TiposDocumentosController } from './tipos-documentos.controller';
import { TiposDocumentoEntity } from './entities/tipos-documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiposDocumentoEntity])],
  controllers: [TiposDocumentosController],
  providers: [TiposDocumentosService],
  exports: [TiposDocumentosService],
})
export class TiposDocumentosModule {}
