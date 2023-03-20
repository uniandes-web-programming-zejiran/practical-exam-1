/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class AlbumDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly cover: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly releaseDate: Date;
}
