import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TiposDocumentosService } from './tipos-documentos.service';
import { CreateTiposDocumentoDto } from './dto/create-tipos-documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos-documento.dto';

@Controller('tipos-documento')
export class TiposDocumentosController {
  constructor(
    private readonly tiposDocumentosService: TiposDocumentosService,
  ) {}

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiposDocumentoDto: UpdateTiposDocumentoDto,
  ) {
    return this.tiposDocumentosService.update(+id, updateTiposDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposDocumentosService.remove(+id);
  }
}
