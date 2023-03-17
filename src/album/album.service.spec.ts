import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from 'src/performer/performer.entity';
import { TrackEntity } from 'src/track/track.entity';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return an album', async () => {
    const album: AlbumEntity = {
      id: '',
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2030-01-01T00:00:00.000Z',
      ),
      description: faker.lorem.sentence(),
      tracks: [new TrackEntity()],
      performers: [new PerformerEntity()],
    };
  });
});
