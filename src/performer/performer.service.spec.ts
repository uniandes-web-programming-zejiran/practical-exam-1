/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';

import { faker } from '@faker-js/faker';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for (let i = 0; i < 5; i++) {
      const performer: PerformerEntity = await repository.save({
        name: faker.lorem.sentence(),
        image: faker.internet.url(),
        description: faker.lorem.paragraph(),
        albums: [],
      });
      performersList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performersList.length);
  });

  it('findOne should return performer by ID', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const performer: PerformerEntity = await service.findOne(
      storedPerformer.id,
    );
    expect(performer).not.toBeNull();
    expect(performer.name).toEqual(storedPerformer.name);
    expect(performer.image).toEqual(storedPerformer.image);
    expect(performer.description).toEqual(storedPerformer.description);
    expect(performer.albums).toEqual(storedPerformer.albums);
  });

  it('findOne should throw exception for an invalid performer', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('create should return a performer', async () => {
    const performer: PerformerEntity = {
      id: '',
      name: faker.lorem.sentence(),
      image: faker.internet.url(),
      description: faker.lorem.sentence(),
      albums: [],
    };

    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({
      where: { id: newPerformer.id },
      relations: ['albums'],
    });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.name).toEqual(newPerformer.name);
    expect(storedPerformer.name).toEqual(newPerformer.name);
    expect(storedPerformer.image).toEqual(newPerformer.image);
    expect(storedPerformer.description).toEqual(newPerformer.description);
    expect(storedPerformer.albums).toEqual(newPerformer.albums);
  });

  it('create should not return a performer with invalid description', async () => {
    const performer: PerformerEntity = {
      id: '',
      name: faker.lorem.sentence(),
      image: faker.internet.url(),
      description: faker.lorem.words(101),
      albums: [],
    };

    await expect(() => service.create(performer)).rejects.toHaveProperty(
      'message',
      'Performer description must have maximum 100 characters',
    );
  });

  it('update should modify a performer', async () => {
    const performer: PerformerEntity = performersList[0];
    performer.name = 'New name';

    const updatedPerformer: PerformerEntity = await service.update(
      performer.id,
      performer,
    );
    expect(updatedPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({
      where: { id: performer.id },
    });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.name).toEqual(performer.name);
  });

  it('update should throw exception for an invalid performer', async () => {
    let performer: PerformerEntity = performersList[0];
    performer = {
      ...performer,
      name: 'New name',
    };
    await expect(() => service.update('0', performer)).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('delete deberia remover un performer', async () => {
    const performer: PerformerEntity = performersList[0];
    await service.delete(performer.id);

    const deletedPerformer: PerformerEntity = await repository.findOne({
      where: { id: performer.id },
    });
    expect(deletedPerformer).toBeNull();
  });

  it('delete should throw exception for an invalid performer', async () => {
    const performer: PerformerEntity = performersList[0];
    await service.delete(performer.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });
});
