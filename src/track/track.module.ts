import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  controllers: [TrackController],
})
export class TrackModule {}
