import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumPerformerService } from './album-performer.service';
import { AlbumPerformerController } from './album-performer.controller';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
  controllers: [AlbumPerformerController],
})
export class AlbumPerformerModule {}
