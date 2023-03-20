import { Test, TestingModule } from '@nestjs/testing';
import { AlbumPerformerService } from './album-performer.service';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
