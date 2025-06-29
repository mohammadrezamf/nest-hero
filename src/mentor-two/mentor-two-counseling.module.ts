import { Module } from '@nestjs/common';
import { MentorTwoCounselingService } from './mentor-two-counseling.service';
import { MentorTwoCounselingController } from './mentor-two-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MentorTwoCounselingTimes,
  MentorTwoTimeSlot,
} from './mentor-two-counseling-entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorTwoCounselingTimes, MentorTwoTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [MentorTwoCounselingService],
  controllers: [MentorTwoCounselingController],
})
export class MentorTwoCounselingModule {}
