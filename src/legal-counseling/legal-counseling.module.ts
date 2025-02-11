import { Module } from '@nestjs/common';
import { LegalCounselingController } from './legal-counseling.controller';
import { LegalCounselingService } from './legal-counseling.service';
import { LegalCounselingTimes, LegalTimeSlot } from './legal-counseling-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LegalCounselingTimes, LegalTimeSlot])],
  controllers: [LegalCounselingController],
  providers: [LegalCounselingService],
})
export class LegalCounselingModule {}
