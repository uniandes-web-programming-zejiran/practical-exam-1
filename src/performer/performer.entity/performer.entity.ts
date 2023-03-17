/* eslint-disable prettier/prettier */
import { AlbumEntity } from 'src/album/album.entity/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class PerformerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @ManyToMany(() => AlbumEntity, (album) => album.performers)
  albums: AlbumEntity[];
}
