import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateHistoricoDto } from './dto/create-historico.dto';
import { UpdateHistoricoDto } from './dto/update-historico.dto';
import { HistoricoEntity } from './entities/historico.entity';
import { DocumentoEntity } from '../documentos/entities/documento.entity';
import { StatusDocumentoEntity } from '../status-documentos/entities/status-documento.entity';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity';

type RelatorioFilters = {
  dataInicio?: string;
  dataFim?: string;
  idTipo?: string;
  idStatusAtual?: string;
  limit?: number;
};

type RelatorioIndicadores = {
  percentualDocumentosEmDia: number;
  tempoMedioAnaliseHoras: number;
};

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

  async findRecentes(limit = 10) {
    const limiteNormalizado = Number.isFinite(limit)
      ? Math.max(1, Math.min(50, Math.trunc(limit)))
      : 10;

    const historicos = await this.historicosRepository.find({
      relations: ['documento', 'status', 'usuario'],
      order: { dataMovimentacao: 'DESC' },
      take: limiteNormalizado,
    });

    return this.anexarStatusAnterior(historicos);
  }

  async findRelatorio(filters?: RelatorioFilters) {
    const limiteInformado = Number(filters?.limit);
    const limiteNormalizado =
      Number.isFinite(limiteInformado) && limiteInformado > 0
        ? Math.max(1, Math.min(5000, Math.trunc(limiteInformado)))
        : undefined;

    const query = this.historicosRepository
      .createQueryBuilder('historico')
      .leftJoinAndSelect('historico.documento', 'documento')
      .leftJoinAndSelect('historico.status', 'status')
      .leftJoinAndSelect('historico.usuario', 'usuario')
      .leftJoinAndSelect('documento.tipo', 'tipoDocumento')
      .leftJoinAndSelect('documento.status', 'statusAtual')
      .orderBy('historico.data_movimentacao', 'DESC');

    if (limiteNormalizado) {
      query.take(limiteNormalizado);
    }

    const dataInicio = filters?.dataInicio?.trim();
    if (dataInicio) {
      query.andWhere('DATE(documento.data_entrada) >= :dataInicio', {
        dataInicio,
      });
    }

    const dataFim = filters?.dataFim?.trim();
    if (dataFim) {
      query.andWhere('DATE(documento.data_entrada) <= :dataFim', {
        dataFim,
      });
    }

    const idTipo = Number(filters?.idTipo);
    if (Number.isFinite(idTipo) && idTipo > 0) {
      query.andWhere('tipoDocumento.id_tipo = :idTipo', { idTipo });
    }

    const idStatusAtual = Number(filters?.idStatusAtual);
    if (Number.isFinite(idStatusAtual) && idStatusAtual > 0) {
      query.andWhere('statusAtual.id_status = :idStatusAtual', {
        idStatusAtual,
      });
    }

    const historicos = await query.getMany();
    return this.anexarStatusAnterior(historicos);
  }

  async findIndicadores(
    filters?: RelatorioFilters,
  ): Promise<RelatorioIndicadores> {
    const query = this.documentosRepository
      .createQueryBuilder('documento')
      .leftJoinAndSelect('documento.status', 'statusAtual')
      .leftJoinAndSelect('documento.tipo', 'tipoDocumento')
      .leftJoinAndSelect('documento.historicos', 'historico')
      .leftJoinAndSelect('historico.status', 'statusHistorico')
      .orderBy('documento.id_documento', 'DESC');

    const dataInicio = filters?.dataInicio?.trim();
    if (dataInicio) {
      query.andWhere('DATE(documento.data_entrada) >= :dataInicio', {
        dataInicio,
      });
    }

    const dataFim = filters?.dataFim?.trim();
    if (dataFim) {
      query.andWhere('DATE(documento.data_entrada) <= :dataFim', {
        dataFim,
      });
    }

    const idTipo = Number(filters?.idTipo);
    if (Number.isFinite(idTipo) && idTipo > 0) {
      query.andWhere('tipoDocumento.id_tipo = :idTipo', { idTipo });
    }

    const idStatusAtual = Number(filters?.idStatusAtual);
    if (Number.isFinite(idStatusAtual) && idStatusAtual > 0) {
      query.andWhere('statusAtual.id_status = :idStatusAtual', {
        idStatusAtual,
      });
    }

    const documentos = await query.getMany();
    if (!documentos.length) {
      return {
        percentualDocumentosEmDia: 0,
        tempoMedioAnaliseHoras: 0,
      };
    }

    const totalDocumentos = documentos.length;
    const documentosEmDia = documentos.filter((doc) => {
      const nomeStatus = (doc.status?.nomeStatus || '').toLowerCase();
      return nomeStatus.includes('finaliz');
    }).length;

    const percentualDocumentosEmDia = Number(
      ((documentosEmDia / totalDocumentos) * 100).toFixed(0),
    );

    const temposAnaliseHoras = documentos
      .map((doc) => {
        const historicosFinalizacao = (doc.historicos || [])
          .filter((hist) => {
            const nomeStatus = (hist.status?.nomeStatus || '').toLowerCase();
            return nomeStatus.includes('finaliz');
          })
          .sort(
            (a, b) =>
              new Date(a.dataMovimentacao).getTime() -
              new Date(b.dataMovimentacao).getTime(),
          );

        const primeiraFinalizacao = historicosFinalizacao[0];
        if (!primeiraFinalizacao || !doc.dataEntrada) {
          return null;
        }

        const inicio = new Date(doc.dataEntrada).getTime();
        const fim = new Date(primeiraFinalizacao.dataMovimentacao).getTime();
        const diffHoras = (fim - inicio) / (1000 * 60 * 60);

        return diffHoras >= 0 ? diffHoras : null;
      })
      .filter((valor): valor is number => valor !== null);

    const tempoMedioAnaliseHoras = temposAnaliseHoras.length
      ? Number(
          (
            temposAnaliseHoras.reduce((acc, valor) => acc + valor, 0) /
            temposAnaliseHoras.length
          ).toFixed(1),
        )
      : 0;

    return {
      percentualDocumentosEmDia,
      tempoMedioAnaliseHoras,
    };
  }

  private async anexarStatusAnterior(historicos: HistoricoEntity[]) {
    if (!historicos.length) {
      return [];
    }

    const historicosComStatusAnterior = await Promise.all(
      historicos.map(async (historico) => {
        const anterior = await this.historicosRepository.findOne({
          where: {
            documento: { idDocumento: historico.documento.idDocumento },
            dataMovimentacao: LessThan(historico.dataMovimentacao),
          },
          relations: ['status'],
          order: { dataMovimentacao: 'DESC' },
        });

        return {
          ...historico,
          statusAnterior: anterior?.status ?? null,
        };
      }),
    );

    return historicosComStatusAnterior;
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
