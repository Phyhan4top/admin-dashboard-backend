import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface'; // Import the custom request type
import { Role } from '@prisma/client'; // Assuming Role is an enum in your Prisma model

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ExtendedRequest>(); // Use the custom request type
    const user = request.user; // Now you can access 'user'

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if the user's role matches any of the required roles
    return requiredRoles.includes(user.role);
  }
}
