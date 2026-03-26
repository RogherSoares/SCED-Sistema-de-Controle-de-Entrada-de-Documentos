import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusDocumentoDto } from './create-status-documento.dto';

export class UpdateStatusDocumentoDto extends PartialType(
  CreateStatusDocumentoDto,
) {}
