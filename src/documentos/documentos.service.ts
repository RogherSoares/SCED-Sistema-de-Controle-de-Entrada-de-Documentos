import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { DocumentoEntity } from './entities/documento.entity';
import { TiposDocumentoEntity } from '../tipos-documentos/entities/tipos-documento.entity';
import { StatusDocumentoEntity } from '../status-documentos/entities/status-documento.entity';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(DocumentoEntity)
    private readonly documentosRepository: Repository<DocumentoEntity>,
    @InjectRepository(TiposDocumentoEntity)
    private readonly tiposRepository: Repository<TiposDocumentoEntity>,
    @InjectRepository(StatusDocumentoEntity)
    private readonly statusRepository: Repository<StatusDocumentoEntity>,
  ) {}

  async create(createDocumentoDto: CreateDocumentoDto) {
    const tipo = await this.tiposRepository.findOne({
      where: { idTipo: createDocumentoDto.idTipo },
    });
    if (!tipo) {
      throw new NotFoundException(
        `Tipo de documento ${createDocumentoDto.idTipo} nao encontrado`,
      );
    }

    const status = await this.statusRepository.findOne({
      where: { idStatus: createDocumentoDto.idStatus },
    });
    if (!status) {
      throw new NotFoundException(
        `Status ${createDocumentoDto.idStatus} nao encontrado`,
      );
    }

    const documento = this.documentosRepository.create({
      protocolo: createDocumentoDto.protocolo,
      remetente: createDocumentoDto.remetente,
      descricao: createDocumentoDto.descricao,
      arquivoUrl: createDocumentoDto.arquivoUrl,
      dataEntrada: new Date(createDocumentoDto.dataEntrada),
      tipo,
      status,
    });

    return this.documentosRepository.save(documento);
  }

  findAll() {
    return this.documentosRepository.find({
      relations: ['tipo', 'status'],
      order: { idDocumento: 'DESC' },
    });
  }

  async findOne(id: number) {
    const documento = await this.documentosRepository.findOne({
      where: { idDocumento: id },
      relations: ['tipo', 'status', 'historicos'],
    });

    if (!documento) {
      throw new NotFoundException(`Documento ${id} nao encontrado`);
    }

    return documento;
  }

  async update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    const documento = await this.findOne(id);

    let tipo = documento.tipo;
    if (updateDocumentoDto.idTipo) {
      const tipoEncontrado = await this.tiposRepository.findOne({
        where: { idTipo: updateDocumentoDto.idTipo },
      });

      if (!tipoEncontrado) {
        throw new NotFoundException(
          `Tipo de documento ${updateDocumentoDto.idTipo} nao encontrado`,
        );
      }

      tipo = tipoEncontrado;
    }

    let status = documento.status;
    if (updateDocumentoDto.idStatus) {
      const statusEncontrado = await this.statusRepository.findOne({
        where: { idStatus: updateDocumentoDto.idStatus },
      });

      if (!statusEncontrado) {
        throw new NotFoundException(
          `Status ${updateDocumentoDto.idStatus} nao encontrado`,
        );
      }

      status = statusEncontrado;
    }

    const documentoAtualizado = this.documentosRepository.merge(documento, {
      protocolo: updateDocumentoDto.protocolo,
      remetente: updateDocumentoDto.remetente,
      descricao: updateDocumentoDto.descricao,
      arquivoUrl: updateDocumentoDto.arquivoUrl,
      dataEntrada: updateDocumentoDto.dataEntrada
        ? new Date(updateDocumentoDto.dataEntrada)
        : documento.dataEntrada,
      tipo,
      status,
    });

    return this.documentosRepository.save(documentoAtualizado);
  }

  async remove(id: number) {
    const documento = await this.findOne(id);
    await this.documentosRepository.remove(documento);
    return { message: `Documento ${id} removido com sucesso` };
  }
}
