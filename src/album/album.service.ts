import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({
      relations: ['tracks', 'performers'],
    });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return album;
  }

  async create(album: AlbumEntity): Promise<AlbumEntity> {
    if (!album.name || !album.description) {
      throw new BusinessLogicException(
        'The album name and description cannot be empty',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.albumRepository.save(album);
  }

  async update(id: string, album: AlbumEntity): Promise<AlbumEntity> {
    const persistedAlbum = await this.albumRepository.findOne({
      where: { id },
    });
    if (!persistedAlbum)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    album.id = id;

    return await this.albumRepository.save({
      ...persistedAlbum,
      ...album,
    });
  }

  async delete(id: string): Promise<void> {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (album.tracks.length > 0) {
      throw new BusinessLogicException(
        'The album cannot be deleted because it has tracks associated with it',
        BusinessError.BAD_REQUEST,
      );
    }
    await this.albumRepository.remove(album);
  }
}
