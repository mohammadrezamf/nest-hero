import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: (req) => {
        console.log('Authorization header:', req.headers.authorization);
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;

    // Check for the user in the database
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
