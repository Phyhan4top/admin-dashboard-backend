import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client'; // Assuming Role is defined in your schema

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
