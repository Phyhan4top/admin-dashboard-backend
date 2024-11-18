import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  Post,
  Get,
  Delete,
  Req,
  Res,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator'; // Import custom roles decorator
import { RolesGuard } from 'src/common/guards/roles.guard'; // Import roles guard
import { Role } from '@prisma/client'; // Assuming Role is defined in your schema
import { CreateUserDto } from 'src/Dto/create.user.dto'; // Create user DTO for validation
import { Response, Request } from 'express';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import * as bcrypt from "bcrypt";


@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    return this.userService.createUser(body, res); // Directly return the result from the service
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.userService.login(body, res); // Directly return the result from the service
  }


  @Get()
  getAllUser(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    this.userService
      .getAllUser(
        Number(page) || 1,
        Number(limit) || 10,
        sortBy || 'createdAt',
        order || 'desc',
      )
      .then((users) => {
        res.status(200).json({
          status: 'success',
          total: users.length,
          data: users,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      });
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id); // Get user by id
  }

  // Only admins can update user details

  @Patch(':id')
  @UseGuards(RolesGuard) // Use roles guard to protect the route
  @Roles(Role.ADMIN) // Only admins can update
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: any,
    @Req() req: ExtendedRequest, // Use the custom request type here
    @Res() res: Response,
  ) {
    const user = req.user; // Access the user from the request

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admins can update users');
    }

    this.userService
      .updateUser(id, updateData)
      .then((user) => {
        res.status(200).json({ status: 'success', data: user });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }); // Proceed to update user
  }

  @Delete()
  deleteAllUsers(
    @Req() req: Request, // Use the custom request type here
    @Res() res: Response,
  ) {
    this.userService
      .deleteAllUser()
      .then(() => {
        res.status(204).json({ status: 'success' });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }); // Delete all users
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Req() req: Request, // Use the custom request type here
    @Res() res: Response,
  ) {
    this.userService
      .deleteUser(id)
      .then(() => {
        res.status(204).json({ status: 'success' });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }); // Delete all users; // Delete user by id
  }
}
