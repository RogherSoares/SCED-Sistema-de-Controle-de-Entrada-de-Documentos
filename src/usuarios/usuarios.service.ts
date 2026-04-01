import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUsuario(usuario: UsuarioEntity) {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, saltRounds);

    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      senha: senhaHash,
    });

    const salvo = await this.usuariosRepository.save(usuario);
    return this.sanitizeUsuario(salvo);
  }

  async findAll() {
    const usuarios = await this.usuariosRepository.find({
      order: { idUsuario: 'ASC' },
    });

    return usuarios.map((usuario) => this.sanitizeUsuario(usuario));
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} nao encontrado`);
    }

    return this.sanitizeUsuario(usuario);
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} nao encontrado`);
    }

    const payloadAtualizacao = { ...updateUsuarioDto };

    if (payloadAtualizacao.senha) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
      payloadAtualizacao.senha = await bcrypt.hash(
        payloadAtualizacao.senha,
        saltRounds,
      );
    }

    const usuarioAtualizado = this.usuariosRepository.merge(
      usuario,
      payloadAtualizacao,
    );
    const salvo = await this.usuariosRepository.save(usuarioAtualizado);
    return this.sanitizeUsuario(salvo);
  }

  async remove(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} nao encontrado`);
    }

    await this.usuariosRepository.remove(usuario);
    return { message: `Usuario ${id} removido com sucesso` };
  }

  async login(email: string, senha: string) {
    const usuario = await this.usuariosRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    let senhaValida = false;

    try {
      senhaValida = await bcrypt.compare(senha, usuario.senha);
    } catch {
      senhaValida = false;
    }

    // Compatibilidade temporaria: permite login com senha legada em texto puro
    // e migra para hash no primeiro login bem-sucedido.
    if (!senhaValida && usuario.senha === senha) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
      usuario.senha = await bcrypt.hash(senha, saltRounds);
      await this.usuariosRepository.save(usuario);
      senhaValida = true;
    }

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      perfil: usuario.perfil,
      nome: usuario.nome,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
      usuario: this.sanitizeUsuario(usuario),
    };
  }
}
