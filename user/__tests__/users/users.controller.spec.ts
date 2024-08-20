import { Test, TestingModule } from '@nestjs/testing';
import { UsersController} from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { UserAvatar } from 'src/users/schemas/user-avatar.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserFromReqRes: jest.fn(),
            getUserAvatar: jest.fn(),
            deleteUserAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = { name: 'John Doe', job: 'Developer' };
      jest.spyOn(usersService, 'createUser').mockResolvedValue(result as any);

      const response = await controller.createUser({ name: 'John Doe', job: 'Developer' });
      expect(response).toEqual(result);
      expect(usersService.createUser).toHaveBeenCalledWith('John Doe', 'Developer');
    });
  });

  describe('getUserAvatar', () => {
    it('should get a user avatar by ID', async () => {
      const avatarData = 'base64string';
      const userId = '1';

      // Mock the `getUserAvatar` method to return the base64 string
      jest.spyOn(usersService, 'getUserAvatar').mockResolvedValue(avatarData);

      const result = await controller.getUserAvatar(userId);
      expect(result).toBe(avatarData);
      expect(usersService.getUserAvatar).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete a user avatar by ID', async () => {
      jest.spyOn(usersService, 'deleteUserAvatar').mockResolvedValue();

      await controller.deleteUserAvatar('1');
      expect(usersService.deleteUserAvatar).toHaveBeenCalledWith('1');
    });
  });
});
