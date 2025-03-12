import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RESOURCE_KEY } from '../../roles/decorators/resource.decorator.';
import { User } from '../../users/entities/user.entity';
import { PayloadDto } from '../dto/token.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const method = request.method;
    const ResourceNames = this.reflector.getAllAndOverride<string | undefined>(
      RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: PayloadDto;
    try {
      payload = await this.jwtService.verifyAsync<PayloadDto>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) throw new UnauthorizedException();

    if (ResourceNames) this.roleValidation(user, ResourceNames, method);

    request['user'] = user;

    return true;
  }

  private roleValidation(
    user: User,
    ResourceNames: string,
    method: string,
  ): void {
    const userResource = user.role.resources.find(
      (resource) => resource.name === ResourceNames,
    );
    if (!userResource) throw new ForbiddenException();

    const writeMethods = ['POST', 'PUT', 'PATCH'];
    const readMethods = ['GET'];
    const deleteMethods = ['DELETE'];

    if (writeMethods.includes(method) && !userResource.writeAccess) {
      throw new ForbiddenException();
    }
    if (readMethods.includes(method) && !userResource.readAccess) {
      throw new ForbiddenException();
    }
    if (deleteMethods.includes(method) && !userResource.deleteAccess) {
      throw new ForbiddenException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
