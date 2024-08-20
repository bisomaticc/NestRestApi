import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { User } from './schemas/user.schema';
import { UserAvatar } from './schemas/user-avatar.schema';
import { RabbitMQService } from './rabbitmq.service';
export declare class UsersService {
    private userModel;
    private userAvatarModel;
    private rabbitMQService;
    private httpService;
    private readonly avatarsTempDir;
    constructor(userModel: Model<User>, userAvatarModel: Model<UserAvatar>, rabbitMQService: RabbitMQService, httpService: HttpService);
    createUser(name: string, job: string): Promise<User>;
    getUserFromReqRes(userId: string): Promise<any>;
    getUserAvatar(userId: string): Promise<string>;
    deleteUserAvatar(userId: string): Promise<void>;
}
