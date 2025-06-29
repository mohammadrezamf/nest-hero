import { Module } from '@nestjs/common';
import { MentorThreeCounselingService } from './mentor-three-counseling.service';
import { MentorThreeCounselingController } from './mentor-three-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MentorThreeCounselingTimes,
  MentorThreeTimeSlot,
} from './mentor-three-counseling-entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorThreeCounselingTimes, MentorThreeTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [MentorThreeCounselingService],
  controllers: [MentorThreeCounselingController],
})
export class MentorThreeCounselingModule {}
