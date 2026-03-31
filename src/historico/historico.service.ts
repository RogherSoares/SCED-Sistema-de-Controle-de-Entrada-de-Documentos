import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoricoDto } from './dto/create-historico.dto';
import { UpdateHistoricoDto } from './dto/update-historico.dto';
import { HistoricoEntity } from './entities/historico.entity';
import { DocumentoEntity } from '../documentos/entities/documento.entity';
import { StatusDocumentoEntity } from '../status-documentos/entities/status-documento.entity';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity';

@Injectable()
export class HistoricoService {
  constructor(
    @InjectRepository(HistoricoEntity)
    private readonly historicosRepository: Repository<HistoricoEntity>,
    @InjectRepository(DocumentoEntity)
    private readonly documentosRepository: Repository<DocumentoEntity>,
    @InjectRepository(StatusDocumentoEntity)
    private readonly statusRepository: Repository<StatusDocumentoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
  ) {}

  async create(createHistoricoDto: CreateHistoricoDto) {
    const documento = await this.documentosRepository.findOne({
      where: { idDocumento: createHistoricoDto.idDocumento },
    });
    if (!documento) {
      throw new NotFoundException(
        `Documento ${createHistoricoDto.idDocumento} nao encontrado`,
      );
    }

    const status = await this.statusRepository.findOne({
      where: { idStatus: createHistoricoDto.idStatus },
    });
    if (!status) {
      throw new NotFoundException(
        `Status ${createHistoricoDto.idStatus} nao encontrado`,
      );
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: createHistoricoDto.idUsuario },
    });
    if (!usuario) {
      throw new NotFoundException(
        `Usuario ${createHistoricoDto.idUsuario} nao encontrado`,
      );
    }

    const historico = this.historicosRepository.create({
      documento,
      status,
      usuario,
      observacao: createHistoricoDto.observacao,
      dataMovimentacao: createHistoricoDto.dataMovimentacao
        ? new Date(createHistoricoDto.dataMovimentacao)
        : undefined,
    });

    return this.historicosRepository.save(historico);
  }

  findAll() {
    return this.historicosRepository.find({
      relations: ['documento', 'status', 'usuario'],
      order: { dataMovimentacao: 'DESC' },
    });
  }

  findByDocumento(idDocumento: number) {
    return this.historicosRepository.find({
      where: { documento: { idDocumento } },
      relations: ['documento', 'status', 'usuario'],
      order: { dataMovimentacao: 'DESC' },
    });
  }

  async findOne(id: number) {
    const historico = await this.historicosRepository.findOne({
      where: { idHistorico: id },
      relations: ['documento', 'status', 'usuario'],
    });

    if (!historico) {
      throw new NotFoundException(`Historico ${id} nao encontrado`);
    }

    return historico;
  }

  async update(id: number, updateHistoricoDto: UpdateHistoricoDto) {
    const historico = await this.findOne(id);

    let documento = historico.documento;
    if (updateHistoricoDto.idDocumento) {
      const documentoEncontrado = await this.documentosRepository.findOne({
        where: { idDocumento: updateHistoricoDto.idDocumento },
      });
      if (!documentoEncontrado) {
        throw new NotFoundException(
          `Documento ${updateHistoricoDto.idDocumento} nao encontrado`,
        );
      }
      documento = documentoEncontrado;
    }

    let status = historico.status;
    if (updateHistoricoDto.idStatus) {
      const statusEncontrado = await this.statusRepository.findOne({
        where: { idStatus: updateHistoricoDto.idStatus },
      });
      if (!statusEncontrado) {
        throw new NotFoundException(
          `Status ${updateHistoricoDto.idStatus} nao encontrado`,
        );
      }
      status = statusEncontrado;
    }

    let usuario = historico.usuario;
    if (updateHistoricoDto.idUsuario) {
      const usuarioEncontrado = await this.usuariosRepository.findOne({
        where: { idUsuario: updateHistoricoDto.idUsuario },
      });
      if (!usuarioEncontrado) {
        throw new NotFoundException(
          `Usuario ${updateHistoricoDto.idUsuario} nao encontrado`,
        );
      }
      usuario = usuarioEncontrado;
    }

    const historicoAtualizado = this.historicosRepository.merge(historico, {
      documento,
      status,
      usuario,
      observacao: updateHistoricoDto.observacao,
      dataMovimentacao: updateHistoricoDto.dataMovimentacao
        ? new Date(updateHistoricoDto.dataMovimentacao)
        : historico.dataMovimentacao,
    });

    return this.historicosRepository.save(historicoAtualizado);
  }

  async remove(id: number) {
    const historico = await this.findOne(id);
    await this.historicosRepository.remove(historico);
    return { message: `Historico ${id} removido com sucesso` };
  }
}
