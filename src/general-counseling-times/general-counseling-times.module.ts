import { Module } from '@nestjs/common';
import { GeneralCounselingTimesController } from './general-counseling-times.controller';
import { GeneralCounselingTimesService } from './general-counseling-times.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CounselingTimeSlot,
  GeneralCounselingTimes,
} from './general.counseling.times.entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneralCounselingTimes, CounselingTimeSlot]),
    AuthModule,
    ResendModule,
  ],
  controllers: [GeneralCounselingTimesController],
  providers: [GeneralCounselingTimesService],
})
export class GeneralCounselingTimesModule {}
