import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';

@Injectable()
export class PerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,
  ) {}

  async findAll(): Promise<PerformerEntity[]> {
    return await this.performerRepository.find({
      relations: ['albums'],
    });
  }

  async findOne(id: string): Promise<PerformerEntity> {
    const performer = await this.performerRepository.findOne({
      where: { id },
      relations: ['albums'],
    });
    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return performer;
  }

  async create(performer: PerformerEntity): Promise<PerformerEntity> {
    if (performer.description.length > 100) {
      throw new BusinessLogicException(
        'Performer description must have maximum 100 characters',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.performerRepository.save(performer);
  }

  async update(
    id: string,
    performer: PerformerEntity,
  ): Promise<PerformerEntity> {
    const persistedPerformer = await this.performerRepository.findOne({
      where: { id },
    });
    if (!persistedPerformer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    performer.id = id;

    return await this.performerRepository.save({
      ...persistedPerformer,
      ...performer,
    });
  }

  async delete(id: string): Promise<void> {
    const performer: PerformerEntity = await this.performerRepository.findOne({
      where: { id },
    });
    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.performerRepository.remove(performer);
  }
}
