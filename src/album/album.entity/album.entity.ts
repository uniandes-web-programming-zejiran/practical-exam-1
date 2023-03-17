/* eslint-disable prettier/prettier */
import { PerformerEntity } from 'src/performer/performer.entity/performer.entity';
import { TrackEntity } from 'src/track/track.entity/track.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cover: string;

  @Column()
  releaseDate: Date;

  @Column()
  description: string;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: TrackEntity[];

  @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
  @JoinTable()
  performers: PerformerEntity[];
}
