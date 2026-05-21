import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(
      loginUsuarioDto.email,
      loginUsuarioDto.senha,
    );
  }

  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: any) {
    const idUsuario = Number(id);
    const isAdmin = (request?.user?.perfil || '').toString() === 'admin';

    if (!isAdmin && Number(request?.user?.idUsuario) !== idUsuario) {
      throw new ForbiddenException('Sem permissao para acessar este usuario.');
    }

    return this.usuariosService.findOne(idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() request: any,
  ) {
    const idUsuario = Number(id);
    const isAdmin = (request?.user?.perfil || '').toString() === 'admin';

    if (!isAdmin && Number(request?.user?.idUsuario) !== idUsuario) {
      throw new ForbiddenException(
        
      
        'Sem permissao para atualizar este usuario.',
      );
    }

    return this.usuariosService.update(idUsuario, updateUsuarioDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
