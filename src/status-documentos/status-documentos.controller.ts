import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatusDocumentosService } from './status-documentos.service';
import { CreateStatusDocumentoDto } from './dto/create-status-documento.dto';
import { UpdateStatusDocumentoDto } from './dto/update-status-documento.dto';

@Controller('status-documento')
export class StatusDocumentosController {
  constructor(
    private readonly statusDocumentosService: StatusDocumentosService,
  ) {}

  @Post()
  create(@Body() createStatusDocumentoDto: CreateStatusDocumentoDto) {
    return this.statusDocumentosService.create(createStatusDocumentoDto);
  }

  @Get()
  findAll() {
    return this.statusDocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusDocumentosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusDocumentoDto: UpdateStatusDocumentoDto,
  ) {
    return this.statusDocumentosService.update(+id, updateStatusDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusDocumentosService.remove(+id);
  }
}
