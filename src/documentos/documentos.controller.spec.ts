import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';

// Mock para o serviço de documentos
const mockDocumentosService = {
  findAll: jest.fn(() => [{ id: 1, protocolo: '2026.001', remetente: 'Teste' }]),
  findOne: jest.fn((id) => ({ id, protocolo: '2026.001', remetente: 'Teste' })),
};

describe('DocumentosController', () => {
  let controller: DocumentosController;
  let service: DocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentosController],
      providers: [
        {
          provide: DocumentosService,
          useValue: mockDocumentosService,
        },
      ],
    }).compile();

    controller = module.get<DocumentosController>(DocumentosController);
    service = module.get<DocumentosService>(DocumentosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all documents', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1, protocolo: '2026.001', remetente: 'Teste' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single document by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: 1, protocolo: '2026.001', remetente: 'Teste' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });
});