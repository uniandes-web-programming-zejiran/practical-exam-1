/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await repository.save({
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

  it('findAll should return all albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumsList.length);
  });

  it('findOne should return album by ID', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(storedAlbum.name).toEqual(album.name);
    expect(storedAlbum.cover).toEqual(album.cover);
    expect(storedAlbum.releaseDate).toEqual(album.releaseDate);
    expect(storedAlbum.description).toEqual(album.description);
  });

  it('findOne should throw exception for an invalid album', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
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
      tracks: [],
      performers: [],
    };

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({
      where: { id: newAlbum.id },
    });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.name).toEqual(newAlbum.name);
    expect(storedAlbum.cover).toEqual(newAlbum.cover);
    expect(storedAlbum.releaseDate).toEqual(newAlbum.releaseDate);
    expect(storedAlbum.description).toEqual(newAlbum.description);
  });

  it('create should not return an album with empty description', async () => {
    const album: AlbumEntity = {
      id: '',
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2030-01-01T00:00:00.000Z',
      ),
      description: '',
      tracks: [],
      performers: [],
    };

    await expect(() => service.create(album)).rejects.toHaveProperty(
      'message',
      'The album name and description cannot be empty',
    );
  });

  it('update should modify a album', async () => {
    const album: AlbumEntity = albumsList[0];
    album.name = 'New name';

    const updatedAlbum: AlbumEntity = await service.update(album.id, album);
    expect(updatedAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({
      where: { id: album.id },
    });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.name).toEqual(album.name);
  });

  it('update should throw exception for an invalid album', async () => {
    let album: AlbumEntity = albumsList[0];
    album = {
      ...album,
      name: 'New name',
    };
    await expect(() => service.update('0', album)).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });

  it('delete deberia remover un album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);

    const deletedAlbum: AlbumEntity = await repository.findOne({
      where: { id: album.id },
    });
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw exception for an invalid album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });
});
