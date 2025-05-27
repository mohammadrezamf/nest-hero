import { Module } from '@nestjs/common';
import { ProductManagerCounselingService } from './product-manager-counseling.service';
import { ProductManagerCounselingController } from './product-manager-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PMCounselingTimes, PMTimeSlot } from './pm-entity';
import { ResendModule } from '../resend/resend.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PMCounselingTimes, PMTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [ProductManagerCounselingService],
  controllers: [ProductManagerCounselingController],
})
export class ProductManagerCounselingModule {}
