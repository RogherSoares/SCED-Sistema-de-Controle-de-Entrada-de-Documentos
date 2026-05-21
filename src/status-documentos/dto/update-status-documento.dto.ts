import { PartialType } from '@nestjs/swagger';
import { CreateStatusDocumentoDto } from './create-status-documento.dto';

export class UpdateStatusDocumentoDto extends PartialType(
  CreateStatusDocumentoDto,
) {}
