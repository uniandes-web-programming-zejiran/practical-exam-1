/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

import { faker } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let tracksList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumRepository.clear();
    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track: TrackEntity = await repository.save({
        name: faker.lorem.sentence(),
        duration: parseInt(faker.random.numeric()),
      });
      tracksList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(tracksList.length);
  });

  it('findOne should return track by ID', async () => {
    const storedTrack: TrackEntity = tracksList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.name).toEqual(storedTrack.name);
    expect(track.duration).toEqual(storedTrack.duration);
  });

  it('findOne should throw exception for an invalid track', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });

  it('create should return a track', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.sentence(),
      cover: faker.lorem.sentence(),
      releaseDate: faker.date.between(
        '2020-01-01T00:00:00.000Z',
        '2030-01-01T00:00:00.000Z',
      ),
      description: faker.lorem.sentence(),
      tracks: [],
      performers: [],
    });

    const track: TrackEntity = {
      id: '',
      name: faker.lorem.sentence(),
      duration: 10,
      album: newAlbum,
    };

    const newTrack: TrackEntity = await service.create(track);
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity = await repository.findOne({
      where: { id: newTrack.id },
      relations: ['album']
    });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.name).toEqual(newTrack.name);
    expect(storedTrack.duration).toEqual(newTrack.duration);
  });

  it('create should not return a track with invalid duration', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.lorem.sentence(),
      duration: -13,
      album: new AlbumEntity(),
    };

    await expect(() => service.create(track)).rejects.toHaveProperty(
      'message',
      'Track duration must be a positive number',
    );
  });

  it('update should modify a track', async () => {
    const track: TrackEntity = tracksList[0];
    track.name = 'New name';

    const updatedTrack: TrackEntity = await service.update(track.id, track);
    expect(updatedTrack).not.toBeNull();

    const storedTrack: TrackEntity = await repository.findOne({
      where: { id: track.id },
    });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.name).toEqual(track.name);
  });

  it('update should throw exception for an invalid track', async () => {
    let track: TrackEntity = tracksList[0];
    track = {
      ...track,
      name: 'New name',
    };
    await expect(() => service.update('0', track)).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });

  it('delete deberia remover un track', async () => {
    const track: TrackEntity = tracksList[0];
    await service.delete(track.id);

    const deletedTrack: TrackEntity = await repository.findOne({
      where: { id: track.id },
    });
    expect(deletedTrack).toBeNull();
  });

  it('delete should throw exception for an invalid track', async () => {
    const track: TrackEntity = tracksList[0];
    await service.delete(track.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });
});
