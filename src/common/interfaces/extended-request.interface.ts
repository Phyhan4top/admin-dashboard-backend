import { User } from '@prisma/client'; // Import Prisma User model

export interface ExtendedRequest extends Request {
  user?: User; // Add 'user' from Prisma User model
}
