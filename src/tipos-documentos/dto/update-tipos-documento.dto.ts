import { PartialType } from '@nestjs/swagger';
import { CreateTiposDocumentoDto } from './create-tipos-documento.dto';

export class UpdateTiposDocumentoDto extends PartialType(
  CreateTiposDocumentoDto,
) {}
