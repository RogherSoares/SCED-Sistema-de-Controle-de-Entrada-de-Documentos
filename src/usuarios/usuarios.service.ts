import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  findAll() {
    return this.usuariosRepository.find({
      order: { idUsuario: 'ASC' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} nao encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    const usuarioAtualizado = this.usuariosRepository.merge(
      usuario,
      updateUsuarioDto,
    );
    return this.usuariosRepository.save(usuarioAtualizado);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
    return { message: `Usuario ${id} removido com sucesso` };
  }

  async login(email: string, senha: string) {
    const usuario = await this.usuariosRepository.findOne({ where: { email } });

    if (!usuario || usuario.senha !== senha) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    return {
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };
  }
}
