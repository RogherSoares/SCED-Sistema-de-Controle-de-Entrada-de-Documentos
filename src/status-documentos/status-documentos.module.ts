import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusDocumentosService } from './status-documentos.service';
import { StatusDocumentosController } from './status-documentos.controller';
import { StatusDocumentoEntity } from './entities/status-documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusDocumentoEntity])],
  controllers: [StatusDocumentosController],
  providers: [StatusDocumentosService],
  exports: [StatusDocumentosService],
})
export class StatusDocumentosModule {}
