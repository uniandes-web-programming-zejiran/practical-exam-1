import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
})
export class TrackModule {}
