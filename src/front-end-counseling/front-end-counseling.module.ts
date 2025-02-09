import { Module } from '@nestjs/common';
import { FrontEndCounselingService } from './front-end-counseling.service';
import { FrontEndCounselingController } from './front-end-counseling.controller';

@Module({
  providers: [FrontEndCounselingService],
  controllers: [FrontEndCounselingController]
})
export class FrontEndCounselingModule {}
