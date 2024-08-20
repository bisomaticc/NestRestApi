import {Controller,Post,Body,Get,Param,Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from './schemas/user.schema';
import { UserAvatar } from './schemas/user-avatar.schema';


@Controller('api/users')
export class UsersController{
    constructor(private readonly usersService: UsersService){}

    @Post()
    async createUser(@Body() createUserDto: {name: string; job: string}): Promise<User>{
        const {name,job}=createUserDto;
        return this.usersService.createUser(name,job);
    }
    @Get(':userId')
    async getUser(@Param('userId') userId: string): Promise<any> {
      return this.usersService.getUserFromReqRes(userId);
    }
    @Get(':userId/avatar')
    async getUserAvatar(@Param('userId') userId: string): Promise<string> {
      return this.usersService.getUserAvatar(userId);
    }
  
    @Delete(':userId/avatar')
    async deleteUserAvatar(@Param('userId') userId: string): Promise<void> {
      await this.usersService.deleteUserAvatar(userId);
    }
  }