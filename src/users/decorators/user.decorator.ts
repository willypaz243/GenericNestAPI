import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    const user: User = request['user'];
    return key ? (user?.[key] as unknown) : user;
  },
);
