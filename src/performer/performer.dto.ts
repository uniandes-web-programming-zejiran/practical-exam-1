/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class PerformerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
