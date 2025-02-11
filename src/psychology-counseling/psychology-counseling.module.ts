import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PsychologyCounselingTimes,
  PsychologyTimeSlot,
} from './psychoogy-counseling-entity';
import { PsychologyCounselingService } from './psychology-counseling.service';
import { PsychologyCounselingController } from './psychology-counseling.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PsychologyCounselingTimes, PsychologyTimeSlot]),
  ],
  providers: [PsychologyCounselingService],
  controllers: [PsychologyCounselingController],
})
export class PsychologyCounselingModule {}
