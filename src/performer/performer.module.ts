import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { PerformerController } from './performer.controller';

@Module({
  providers: [PerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity])],
  controllers: [PerformerController],
})
export class PerformerModule {}
