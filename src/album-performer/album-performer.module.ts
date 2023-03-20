import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumPerformerService } from './album-performer.service';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
})
export class AlbumPerformerModule {}
