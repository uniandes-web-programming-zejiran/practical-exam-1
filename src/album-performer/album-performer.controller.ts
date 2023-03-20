/* eslint-disable prettier/prettier */
import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AlbumPerformerService } from './album-performer.service';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumPerformerController {
  constructor(private readonly performerAlbumService: AlbumPerformerService) {}

  @Post(':albumId/performers/:performerId')
  async addPerformerToAlbum(
    @Param('albumId') albumId: string,
    @Param('performerId') performerId: string,
  ) {
    return await this.performerAlbumService.addPerformerToAlbum(
      albumId,
      performerId,
    );
  }
}
