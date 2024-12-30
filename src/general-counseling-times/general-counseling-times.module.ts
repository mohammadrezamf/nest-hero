import { Module } from '@nestjs/common';
import { GeneralCounselingTimesController } from './general-counseling-times.controller';
import { GeneralCounselingTimesService } from './general-counseling-times.service';

@Module({
  controllers: [GeneralCounselingTimesController],
  providers: [GeneralCounselingTimesService]
})
export class GeneralCounselingTimesModule {}
