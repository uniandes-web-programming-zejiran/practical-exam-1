import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

@Module({
  providers: [TrackService],
  imports: [
    TypeOrmModule.forFeature([TrackEntity]),
    TypeOrmModule.forFeature([AlbumEntity]),
  ],
})
export class TrackModule {}
