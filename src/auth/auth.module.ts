import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { MentorOneCounselingModule } from '../mentor-one/mentor-one-counseling.module';
import { MentorTwoCounselingModule } from '../mentor-two/mentor-two-counseling.module';
import { MentorThreeCounselingModule } from '../mentor-three/mentor-three-counseling.module';

@Module({
  imports: [
    forwardRef(() => MentorOneCounselingModule),
    forwardRef(() => MentorTwoCounselingModule),
    forwardRef(() => MentorThreeCounselingModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: { expiresIn: '17361907396' },
    }),
    TypeOrmModule.forFeature([User, CounselingTimeSlot]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
