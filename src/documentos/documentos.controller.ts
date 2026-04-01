import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadDir = join(process.cwd(), 'uploads');
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (_req, file, callback) => {
          const extension = extname(file.originalname || '').toLowerCase();
          const base = (file.originalname || 'arquivo')
            .replace(extension, '')
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .slice(0, 60);
          const sufixo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${base || 'arquivo'}-${sufixo}${extension}`);
        },
      }),
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  uploadArquivo(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const extensao = extname(file.originalname || '').toLowerCase();
    const extensoesPermitidas = new Set([
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.csv',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.zip',
      '.rar',
    ]);

    if (!extensoesPermitidas.has(extensao)) {
      throw new BadRequestException(
        'Formato de arquivo nao suportado para upload.',
      );
    }

    return {
      arquivoUrl: `/uploads/${file.filename}`,
      nomeOriginal: file.originalname,
      tamanho: file.size,
    };
  }

  @Delete('upload')
  async removerArquivoUpload(@Query('arquivoUrl') arquivoUrl?: string) {
    if (!arquivoUrl) {
      throw new BadRequestException('URL do arquivo nao informada.');
    }

    const nomeArquivo = basename(arquivoUrl);
    if (!nomeArquivo) {
      throw new BadRequestException('Arquivo invalido para remocao.');
    }

    const caminhoArquivo = join(process.cwd(), 'uploads', nomeArquivo);

    try {
      await unlink(caminhoArquivo);
    } catch {
      return {
        removido: false,
        message: 'Arquivo nao encontrado ou ja removido.',
      };
    }

    return { removido: true, message: 'Arquivo removido com sucesso.' };
  }

  @Get()
  findAll(
    @Query('protocolo') protocolo?: string,
    @Query('idTipo') idTipo?: string,
    @Query('idStatus') idStatus?: string,
    @Query('remetente') remetente?: string,
  ) {
    return this.documentosService.findAll({
      protocolo,
      idTipo,
      idStatus,
      remetente,
    });
  }

  @Get('metrics/dashboard')
  getDashboardMetrics() {
    return this.documentosService.getDashboardMetrics();
  }

  @Get('next-protocolo')
  getNextProtocolo() {
    return this.documentosService.getNextProtocolo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentosService.update(+id, updateDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentosService.remove(+id);
  }
}
