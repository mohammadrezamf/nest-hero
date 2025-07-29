import { forwardRef, Module } from '@nestjs/common';
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
    forwardRef(() => AuthModule),
  ],
  providers: [MentorTwoCounselingService],
  controllers: [MentorTwoCounselingController],
  exports: [MentorTwoCounselingService],
})
export class MentorTwoCounselingModule {}
