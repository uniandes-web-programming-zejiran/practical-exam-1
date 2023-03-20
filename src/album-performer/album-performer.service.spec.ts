import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await albumRepository.save({
        name: faker.lorem.sentence(),
        cover: faker.lorem.sentence(),
        releaseDate: faker.date.between(
          '2020-01-01T00:00:00.000Z',
          '2030-01-01T00:00:00.000Z',
        ),
        description: faker.lorem.sentence(),
      });
      albumsList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerToAlbum should add album to performer', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      name: faker.lorem.sentence(),
      image: faker.internet.url(),
      description: faker.lorem.paragraph(),
      albums: [],
    });

    const newAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2030-01-01T00:00:00.000Z',
      ),
      description: faker.lorem.sentence(),
    });

    const result: AlbumEntity = await service.addPerformerToAlbum(
      newAlbum.id,
      newPerformer.id,
    );

    expect(result.performers).not.toBeNull();
    expect(result.performers[0].name).toBe(newPerformer.name);
    expect(result.performers[0].image).toBe(newPerformer.image);
    expect(result.performers[0].description).toBe(newPerformer.description);
  });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2030-01-01T00:00:00.000Z',
      ),
      description: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addPerformerToAlbum(newAlbum.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      name: faker.lorem.sentence(),
      image: faker.internet.url(),
      description: faker.lorem.paragraph(),
      albums: [],
    });

    await expect(() =>
      service.addPerformerToAlbum('0', newPerformer.id),
    ).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });
});
