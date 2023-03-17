import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';

describe('PerformerService', () => {
  let service: PerformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
