import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { EmailService } from '../auth/email.service';
import { TwoFactorCodeEntity } from '../auth/entities/two-factor-code.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepository: Repository<UsuarioEntity>,

    @InjectRepository(TwoFactorCodeEntity)
    private readonly twoFactorRepository: Repository<TwoFactorCodeEntity>,

    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private sanitizeUsuario(usuario: UsuarioEntity) {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  private gerarCodigoAutenticacao(): string {
    return randomInt(100000, 1000000).toString();
  }

  private async gerarToken(usuario: UsuarioEntity) {
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

    return {
      message: `Usuario ${id} removido com sucesso`,
    };
  }

  async login(email: string, senha: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    let senhaValida = false;

    try {
      senhaValida = await bcrypt.compare(senha, usuario.senha);
    } catch {
      senhaValida = false;
    }

    // Compatibilidade temporaria com senhas antigas em texto puro.
    // No primeiro login correto, a senha antiga é convertida para hash.
    if (!senhaValida && usuario.senha === senha) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

      usuario.senha = await bcrypt.hash(senha, saltRounds);

      await this.usuariosRepository.save(usuario);

      senhaValida = true;
    }

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    // Invalida códigos anteriores que ainda não foram utilizados.
    const codigosPendentes = await this.twoFactorRepository.find({
      where: {
        usuario: {
          idUsuario: usuario.idUsuario,
        },
        utilizado: false,
      },
    });

    if (codigosPendentes.length > 0) {
      for (const codigoPendente of codigosPendentes) {
        codigoPendente.utilizado = true;
      }

      await this.twoFactorRepository.save(codigosPendentes);
    }

    const codigo = this.gerarCodigoAutenticacao();
    const codigoHash = await bcrypt.hash(codigo, 10);

    const minutosExpiracao = Number(
      process.env.TWO_FACTOR_CODE_EXPIRES_MINUTES ?? 5,
    );

    const expiraEm = new Date(
      Date.now() + minutosExpiracao * 60 * 1000,
    );

    const registroCodigo = this.twoFactorRepository.create({
      codigoHash,
      expiraEm,
      utilizado: false,
      tentativas: 0,
      usuario,
    });

    await this.twoFactorRepository.save(registroCodigo);

    await this.emailService.enviarCodigoAutenticacao(
      usuario.email,
      usuario.nome,
      codigo,
    );

    return {
      requiresTwoFactor: true,
      usuarioId: usuario.idUsuario,
      message: 'Codigo de autenticacao enviado para o email cadastrado.',
      expiresInMinutes: minutosExpiracao,
    };
  }

  async verificarCodigo(usuarioId: number, codigo: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        idUsuario: usuarioId,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException(
        'Codigo de autenticacao invalido',
      );
    }

    const registroCodigo = await this.twoFactorRepository.findOne({
      where: {
        usuario: {
          idUsuario: usuarioId,
        },
        utilizado: false,
      },
      order: {
        criadoEm: 'DESC',
      },
    });

    if (!registroCodigo) {
      throw new UnauthorizedException(
        'Codigo de autenticacao invalido ou ja utilizado',
      );
    }

    if (registroCodigo.expiraEm.getTime() < Date.now()) {
      registroCodigo.utilizado = true;

      await this.twoFactorRepository.save(registroCodigo);

      throw new UnauthorizedException(
        'Codigo expirado. Realize o login novamente.',
      );
    }

    if (registroCodigo.tentativas >= 5) {
      registroCodigo.utilizado = true;

      await this.twoFactorRepository.save(registroCodigo);

      throw new UnauthorizedException(
        'Limite de tentativas excedido. Realize o login novamente.',
      );
    }

    const codigoValido = await bcrypt.compare(
      codigo,
      registroCodigo.codigoHash,
    );

    if (!codigoValido) {
      registroCodigo.tentativas += 1;

      if (registroCodigo.tentativas >= 5) {
        registroCodigo.utilizado = true;
      }

      await this.twoFactorRepository.save(registroCodigo);

      throw new UnauthorizedException(
        'Codigo de autenticacao invalido',
      );
    }

    registroCodigo.utilizado = true;

    await this.twoFactorRepository.save(registroCodigo);

    return this.gerarToken(usuario);
  }
}