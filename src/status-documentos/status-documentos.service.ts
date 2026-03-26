import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusDocumentoDto } from './dto/create-status-documento.dto';
import { UpdateStatusDocumentoDto } from './dto/update-status-documento.dto';
import { StatusDocumentoEntity } from './entities/status-documento.entity';

@Injectable()
export class StatusDocumentosService {
  constructor(
    @InjectRepository(StatusDocumentoEntity)
    private readonly statusRepository: Repository<StatusDocumentoEntity>,
  ) {}

  create(createStatusDocumentoDto: CreateStatusDocumentoDto) {
    const status = this.statusRepository.create(createStatusDocumentoDto);
    return this.statusRepository.save(status);
  }

  findAll() {
    return this.statusRepository.find({ order: { idStatus: 'ASC' } });
  }

  async findOne(id: number) {
    const status = await this.statusRepository.findOne({
      where: { idStatus: id },
    });
    if (!status) {
      throw new NotFoundException(`Status ${id} nao encontrado`);
    }
    return status;
  }

  async update(id: number, updateStatusDocumentoDto: UpdateStatusDocumentoDto) {
    const status = await this.findOne(id);
    const statusAtualizado = this.statusRepository.merge(
      status,
      updateStatusDocumentoDto,
    );
    return this.statusRepository.save(statusAtualizado);
  }

  async remove(id: number) {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
    return { message: `Status ${id} removido com sucesso` };
  }
}
