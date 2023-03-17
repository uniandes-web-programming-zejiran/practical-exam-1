import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from 'src/album/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,

    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find({
      relations: ['album'],
    });
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
    if (!track)
      throw new BusinessLogicException(
        'The track with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return track;
  }

  async create(track: TrackEntity): Promise<TrackEntity> {
    if (!track.album) {
      throw new BusinessLogicException(
        'Cannot create a track without an associated album',
        BusinessError.BAD_REQUEST,
      );
    }

    if (isNaN(track.duration) || track.duration <= 0) {
      throw new BusinessLogicException(
        'Track duration must be a positive number',
        BusinessError.BAD_REQUEST,
      );
    }

    const album = await this.albumRepository.findOne({
      where: { id: track.album.id },
    });
    if (!album) {
      throw new BusinessLogicException(
        'Cannot create a track with an invalid associated album',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.trackRepository.save(track);
  }

  async update(id: string, track: TrackEntity): Promise<TrackEntity> {
    const persistedTrack = await this.trackRepository.findOne({
      where: { id },
    });
    if (!persistedTrack)
      throw new BusinessLogicException(
        'The track with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    track.id = id;

    return await this.trackRepository.save({
      ...persistedTrack,
      ...track,
    });
  }

  async delete(id: string): Promise<void> {
    const track: TrackEntity = await this.trackRepository.findOne({
      where: { id },
    });
    if (!track)
      throw new BusinessLogicException(
        'The track with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.trackRepository.remove(track);
  }
}
