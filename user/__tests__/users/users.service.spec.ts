import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { HttpService } from '@nestjs/axios';
import { MailerService } from '@nestjs-modules/mailer';
import { RabbitMQService } from '../../src/users/rabbitmq.service';
import { User } from '../../src/users/schemas/user.schema';
import { UserAvatar } from '../../src/users/schemas/user-avatar.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { HttpModule } from '@nestjs/axios';
import { AxiosInstance } from 'axios';


describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let userAvatarModel: Model<UserAvatar>;
  let httpService: HttpService;
  let rabbitMQService: RabbitMQService;

  const avatarsTempDir = path.join(__dirname, '../../temp_avatars');
  const userId = '1';
  const avatarUrl = 'https://reqres.in/img/faces/1-image.jpg';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UsersService,
        HttpService,
        RabbitMQService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue({
              _id: 'someId',
              name: 'John Doe',
              job: 'Developer',
            }),
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken(UserAvatar.name),
        useValue: {
          create: jest.fn().mockResolvedValue({
            _id: 'someId',
            userId,
            avatarHash: 'avatarHash',
            filePath: '',
          }),
          findOne: jest.fn().mockResolvedValue({
            _id: 'someId',
            userId,
            avatarHash: 'avatarHash',
            filePath: '',
          }),
          findOneAndDelete: jest.fn(),
        },
      },
    ],
  }).compile();
  
    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    userAvatarModel = module.get<Model<UserAvatar>>(getModelToken(UserAvatar.name));
    httpService = module.get<HttpService>(HttpService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);

    if (!fs.existsSync(avatarsTempDir)) {
      fs.mkdirSync(avatarsTempDir);
    }
  });

  // describe('createUser', () => {
  //   it('should create a new user and send a RabbitMQ event', async () => {
  //     const newUser = { _id: 'someId', name: 'John Doe', job: 'Developer' };
      
  //     // Mock `create` to return a resolved value
  //     jest.spyOn(userModel, 'create').mockResolvedValue(newUser as any);
      
  //     // Mock `sendUserCreatedEvent` to resolve without error
  //     jest.spyOn(rabbitMQService, 'sendUserCreatedEvent').mockResolvedValue(undefined);
      
  //     const result = await service.createUser('John Doe', 'Developer');
      
  //     expect(result).toEqual(newUser);
  //     expect(userModel.create).toHaveBeenCalledWith({ name: 'John Doe', job: 'Developer' });
  //     expect(rabbitMQService.sendUserCreatedEvent).toHaveBeenCalledWith(newUser);
  //   });
  // });
// to be used with rabbitmq
// describe('createUser', () => {
//   it('should create a new user and send an email', async () => {
//     const newUser = { name: 'John Doe', job: 'Developer', _id: 'someId' };
    
//     // Call the service method
//     await service.createUser(newUser.name, newUser.job);

//     // Check that sendMail was called
//     expect(mailerService.sendMail).toHaveBeenCalledWith({
//       to: expect.any(String), // or specify the exact email address
//       subject: expect.any(String), // or specify the exact subject
//       template: expect.any(String), // or specify the template path
//       context: {
//         name: newUser.name,
//         job: newUser.job,
//       },
//     });
// used with email


});