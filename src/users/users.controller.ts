import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
  Delete,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator'; // Import custom roles decorator
import { RolesGuard } from 'src/common/guards/roles.guard'; // Import roles guard
import { Role } from '@prisma/client'; // Assuming Role is defined in your schema
import { CreateUserDto } from 'src/Dto/create.user.dto'; // Create user DTO for validation
import { Response } from 'express';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    try {
      await this.userService.createUser(body, res);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('/login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      await this.userService.login(body, res);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Get()
  async getAllUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Res() res: Response,
  ) {
    try {
      const users = await this.userService.getAllUser(
        Number(page),
        Number(limit),
        sortBy,
        order,
      );
      return res.status(200).json({
        status: 'success',
        meta: users.meta,
        data: users.data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUser(id);
      return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
  }

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

  @Patch('update-many')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateMany(
    @Body() body: { ids: string[]; data: any },
    @Req() req: ExtendedRequest, // Use the custom request type here
    @Res() res: Response,
  ) {
    try {
      const user = req.user;

      if (user.role !== Role.ADMIN) {
        throw new UnauthorizedException('Only admins can update users');
      }

      if (!body.ids || !body.ids.length) {
        throw new Error('IDs are required');
      }
      const resultCount = await this.userService.updateManyUsers(
        body.ids,
        body.data,
      );
      return res
        .status(200)
        .json({ status: 'success', updatedCount: resultCount });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  @Delete('delete-many')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteMany(
    @Body() body: { ids: string[] },
    @Res() res: Response,
    @Req() req: ExtendedRequest,
  ) {
    try {
      const user = req.user;

      if (user.role !== Role.ADMIN) {
        throw new UnauthorizedException('Only admins can update users');
      }

      if (!body.ids || !body.ids.length) {
        throw new Error('IDs are required');
      }
      const result = await this.userService.deleteManyUsers(body.ids);
      return res
        .status(200)
        .json({ status: 'success', deleteCount: result.deleteCount });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: ExtendedRequest,
  ) {
    try {
      const user = req.user;

      if (user.role !== Role.ADMIN) {
        throw new UnauthorizedException('Only admins can update users');
      }
      await this.userService.deleteUser(id);
      return res.status(204).json({ status: 'success' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
