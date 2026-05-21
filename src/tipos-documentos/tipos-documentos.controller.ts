import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { TiposDocumentosService } from './tipos-documentos.service';
import { CreateTiposDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos-documento.dto';

@ApiTags('TiposDocumentos')
@Controller('tipos-documento')
export class TiposDocumentosController {
  constructor(
    private readonly tiposDocumentosService: TiposDocumentosService,
  ) {}

  @Roles('admin')
  @Post()
  create(@Body() createTiposDocumentoDto: CreateTiposDocumentoDto) {
    return this.tiposDocumentosService.create(createTiposDocumentoDto);
  }

  @Get()
  findAll() {
    return this.tiposDocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposDocumentosService.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiposDocumentoDto: UpdateTiposDocumentoDto,
  ) {
    return this.tiposDocumentosService.update(+id, updateTiposDocumentoDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposDocumentosService.remove(+id);
  }
}
