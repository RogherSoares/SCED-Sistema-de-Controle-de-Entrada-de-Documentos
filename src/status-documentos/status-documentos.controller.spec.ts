import { Test, TestingModule } from '@nestjs/testing';
import { StatusDocumentosController } from './status-documentos.controller';
import { StatusDocumentosService } from './status-documentos.service';

describe('StatusDocumentosController', () => {
  let controller: StatusDocumentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusDocumentosController],
      providers: [StatusDocumentosService],
    }).compile();

    controller = module.get<StatusDocumentosController>(
      StatusDocumentosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
