import { Module } from '@nestjs/common';
import { FrontEndCounselingService } from './front-end-counseling.service';
import { FrontEndCounselingController } from './front-end-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FrontEndCounselingTimes,
  FrontEndTimeSlot,
} from './front-end-counseling-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrontEndCounselingTimes, FrontEndTimeSlot]),
  ],
  providers: [FrontEndCounselingService],
  controllers: [FrontEndCounselingController],
})
export class FrontEndCounselingModule {}
