import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity';
import { PerformerEntity } from 'src/performer/performer.entity';
import { AlbumPerformerService } from './album-performer.service';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
})
export class AlbumPerformerModule {}
