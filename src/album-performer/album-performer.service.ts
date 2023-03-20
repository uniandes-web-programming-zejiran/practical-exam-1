import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AlbumPerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,

    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}
  async addPerformerToAlbum(
    albumId: string,
    performerId: string,
  ): Promise<AlbumEntity> {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const performer: PerformerEntity = await this.performerRepository.findOne({
      where: { id: performerId },
    });
    if (!performer)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (album.performers.length >= 3)
      throw new BusinessLogicException(
        'The album already has the maximum number of performers',
        BusinessError.PRECONDITION_FAILED,
      );

    album.performers = [...album.performers, performer];
    return await this.albumRepository.save(album);
  }
}
