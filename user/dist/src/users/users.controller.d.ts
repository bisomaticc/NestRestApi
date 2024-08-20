import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: {
        name: string;
        job: string;
    }): Promise<User>;
    getUser(userId: string): Promise<any>;
    getUserAvatar(userId: string): Promise<string>;
    deleteUserAvatar(userId: string): Promise<void>;
}
