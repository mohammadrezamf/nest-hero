import { Module } from '@nestjs/common';
import { FrontEndCounselingService } from './front-end-counseling.service';
import { FrontEndCounselingController } from './front-end-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FrontEndCounselingTimes,
  FrontEndTimeSlot,
} from './front-end-counseling-entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrontEndCounselingTimes, FrontEndTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [FrontEndCounselingService],
  controllers: [FrontEndCounselingController],
})
export class FrontEndCounselingModule {}
