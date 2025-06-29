import { Module } from '@nestjs/common';
import { MentorFourCounselingService } from './mentor-four-counseling.service';
import { MentorFourCounselingController } from './mentor-four-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MentorFourCounselingTimes,
  MentorFourTimeSlot,
} from './mentor-four-counseling-entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorFourCounselingTimes, MentorFourTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [MentorFourCounselingService],
  controllers: [MentorFourCounselingController],
})
export class MentorFourCounselingModule {}
