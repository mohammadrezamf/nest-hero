import { Module } from '@nestjs/common';
import { BackEndCounselingService } from './back-end-counseling.service';
import { BackEndCounselingController } from './back-end-counseling.controller';
import {
  BackEndCounselingTimes,
  BackEndTimeSlot,
} from './back-end-counseling-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResendModule } from '../resend/resend.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackEndCounselingTimes, BackEndTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [BackEndCounselingService],
  controllers: [BackEndCounselingController],
})
export class BackEndCounselingModule {}
