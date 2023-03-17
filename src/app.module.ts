import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';

@Module({
  imports: [AlbumModule, TrackModule, PerformerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
