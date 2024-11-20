import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Ensure this exists
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private env: ConfigService,
  ) {}

  createToken(userId: string): string {
    const secret = this.env.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id: userId }, secret, {
      expiresIn: Number(this.env.get('TOKEN_EXPIRES')) || '1d',
    });
  }

  sendToken(user: any, statusCode: number, res: Response): void {
    const token = this.createToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(this.env.get('TOKEN_COOKIE_EXPIRES') || 24) * 3600000,
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'none',
    };

    res
      .cookie('jwt', token, cookieOptions as any)
      .status(statusCode)
      .json({
        status: 'success',
        token,
        data: {
          user: { ...user, password: undefined },
        },
      });
  }
  hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 13);
    return hash;
  };
  checkPassword = async (
    inputPassword: string,
    userPassword: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, userPassword);
  };

  async createUser(
    info: { email: string; password: string; username: string },
    res: Response,
  ): Promise<void> {
    info.password = await this.hashPassword(info.password);
    info.email = info.email.toLowerCase();
   this.prisma.user
      .create({
        data: info,
      })
      .then((user) => {
        this.sendToken(user, 201, res);
      })
      .catch((err) => {
        res.status(404).json({
          status: 'error',
          message: err.message,
        });
      });
  }

  async login(
    body: { email: string; password: string },
    res: any,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email.toLocaleLowerCase() },
    });

   if (!user || !(await this.checkPassword(body.password, user.password))) {
    return res.status(404).json({
    status: 'error',
    message: 'Incorrect email or password',
  });
}
    this.sendToken(user, 200, res);
  }

  async getUser(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUser(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const totalRecords = await this.prisma.user.count();
    const totalPages = Math.ceil(totalRecords / limit);

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    });

    return {
      meta: {
        currentPage: page,
        totalPages,
        totalRecords,
      },
      status: 'success',
      data: users,
    };
  }

  async updateUser(id: string, body: any): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  async deleteUser(id: string): Promise<any> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async deleteAllUser(): Promise<{ deleteCount?: number }> {
    const result = await this.prisma.user.deleteMany();
    return { deleteCount: result.count };
  }

  async updateManyUsers(ids: string[], data: any): Promise < {} > {
  return  await this.prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data,
  })
}

async deleteManyUsers(ids: string[]): Promise<{ deleteCount: number }> {
  const result = await this.prisma.user.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return { deleteCount: result.count };
}
}