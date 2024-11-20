import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../../prisma/prisma.service'; // Import Prisma service

// Extend the Request type to include 'user' from Prisma model
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface'; // Import the custom request type

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {
       console.log('PrismaService Injected:', prisma);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return next();
      }

      // Verify JWT token and extract user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };

      // Fetch the user from the database using Prisma
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return next();
      }

      // Attach the user to the request object
      (req as unknown as ExtendedRequest).user = user;

      next();
    } catch (err) {
      return next(err);
    }
  }
}
