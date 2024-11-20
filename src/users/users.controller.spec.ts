import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { PrismaService } from "../prisma/prisma.service";

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController], // Use the class directly
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {}, // Mock PrismaService (empty mock for now)
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController); // Correctly get the controller
    service = module.get<UserService>(UserService); // Optional: Get the service if needed
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
