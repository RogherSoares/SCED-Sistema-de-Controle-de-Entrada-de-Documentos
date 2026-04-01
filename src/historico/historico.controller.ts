import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HistoricoService } from './historico.service';
import { CreateHistoricoDto } from './dto/create-historico.dto';
import { UpdateHistoricoDto } from './dto/update-historico.dto';

@Controller('historicos')
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @Post()
  create(@Body() createHistoricoDto: CreateHistoricoDto) {
    return this.historicoService.create(createHistoricoDto);
  }

  @Get()
  findAll() {
    return this.historicoService.findAll();
  }

  @Get('recentes')
  findRecentes(@Query('limit') limit?: string) {
    return this.historicoService.findRecentes(limit ? Number(limit) : 10);
  }

  @Get('relatorio')
  findRelatorio(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('idTipo') idTipo?: string,
    @Query('idStatusAtual') idStatusAtual?: string,
    @Query('limit') limit?: string,
  ) {
    return this.historicoService.findRelatorio({
      dataInicio,
      dataFim,
      idTipo,
      idStatusAtual,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('indicadores')
  findIndicadores(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('idTipo') idTipo?: string,
    @Query('idStatusAtual') idStatusAtual?: string,
  ) {
    return this.historicoService.findIndicadores({
      dataInicio,
      dataFim,
      idTipo,
      idStatusAtual,
    });
  }

  @Get('documento/:idDocumento')
  findByDocumento(@Param('idDocumento') idDocumento: string) {
    return this.historicoService.findByDocumento(+idDocumento);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoricoDto: UpdateHistoricoDto,
  ) {
    return this.historicoService.update(+id, updateHistoricoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicoService.remove(+id);
  }
}
