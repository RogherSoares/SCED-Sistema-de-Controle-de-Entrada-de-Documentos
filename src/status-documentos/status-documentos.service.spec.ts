import { Test, TestingModule } from '@nestjs/testing';
import { StatusDocumentosService } from './status-documentos.service';

describe('StatusDocumentosService', () => {
  let service: StatusDocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusDocumentosService],
    }).compile();

    service = module.get<StatusDocumentosService>(StatusDocumentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
