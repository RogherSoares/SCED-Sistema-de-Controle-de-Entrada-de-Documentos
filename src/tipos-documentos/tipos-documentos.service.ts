import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTiposDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos-documento.dto';
import { TiposDocumentoEntity } from './entities/tipos-documento.entity';

@Injectable()
export class TiposDocumentosService {
  constructor(
    @InjectRepository(TiposDocumentoEntity)
    private readonly tiposRepository: Repository<TiposDocumentoEntity>,
  ) {}

  create(createTiposDocumentoDto: CreateTiposDocumentoDto) {
    const tipo = this.tiposRepository.create(createTiposDocumentoDto);
    return this.tiposRepository.save(tipo);
  }

  findAll() {
    return this.tiposRepository.find({ order: { idTipo: 'ASC' } });
  }

  async findOne(id: number) {
    const tipo = await this.tiposRepository.findOne({ where: { idTipo: id } });
    if (!tipo) {
      throw new NotFoundException(`Tipo de documento ${id} nao encontrado`);
    }
    return tipo;
  }

  async update(id: number, updateTiposDocumentoDto: UpdateTiposDocumentoDto) {
    const tipo = await this.findOne(id);
    const tipoAtualizado = this.tiposRepository.merge(
      tipo,
      updateTiposDocumentoDto,
    );
    return this.tiposRepository.save(tipoAtualizado);
  }

  async remove(id: number) {
    const tipo = await this.findOne(id);
    await this.tiposRepository.remove(tipo);
    return { message: `Tipo de documento ${id} removido com sucesso` };
  }
}
