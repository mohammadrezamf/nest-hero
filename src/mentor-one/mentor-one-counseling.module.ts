import { Module } from '@nestjs/common';
import { MentorOneCounselingService } from './mentor-one-counseling.service';
import { MentorOneCounselingController } from './mentor-one-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MentorOneCounselingTimes,
  MentorOneTimeSlot,
} from './mentor-one-counseling-entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorOneCounselingTimes, MentorOneTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [MentorOneCounselingService],
  controllers: [MentorOneCounselingController],
})
export class MentorOneCounselingModule {}
