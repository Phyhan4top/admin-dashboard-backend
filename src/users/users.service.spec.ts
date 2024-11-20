import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, Status } from '@prisma/client';

describe('UsersService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
              updateMany: jest.fn(),
            },
          }, // Mock PrismaService methods as needed
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
     const mockUser = {
       id: '1',
       username: 'Username',
       email: 'test@example.com',
       password: 'hashedpassword',
       role: 'ADMIN' as Role, // Assuming 'ADMIN' is a valid value of the `Role` enum
       status: 'ACTIVE' as Status, // Assuming 'ACTIVE' is a valid value of the `Status` enum
       createdAt: new Date(), // Corrected property name and type
       updatedAt: new Date(), // Corrected property name and type
     };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.getUser('1');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('deleteManyUsers', () => {
    it('should delete users and return delete count', async () => {
      const mockDeleteResult = { count: 2 };
      jest.spyOn(prisma.user, 'deleteMany').mockResolvedValue(mockDeleteResult);

      const result = await service.deleteManyUsers(['1', '2']);
      expect(result).toEqual({ deleteCount: 2 });
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ['1', '2'] } },
      });
    });
  });
});
