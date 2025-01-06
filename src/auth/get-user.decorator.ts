import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, cts: ExecutionContext): User => {
    const req = cts.switchToHttp().getRequest();
    return req.user;
  },
);
