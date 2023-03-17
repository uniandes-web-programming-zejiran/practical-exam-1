/* eslint-disable prettier/prettier */
import { AlbumEntity } from 'src/album/album.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks)
  album: AlbumEntity;
}
