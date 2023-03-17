/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity';
import { PerformerEntity } from 'src/performer/performer.entity';
import { TrackEntity } from 'src/track/track.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      AlbumEntity,
      TrackEntity,
      PerformerEntity,
    ],

    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    AlbumEntity,
    TrackEntity,
    PerformerEntity,
  ]),
];
