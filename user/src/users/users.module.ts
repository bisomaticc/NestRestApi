import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { UserAvatar, UserAvatarSchema } from './schemas/user-avatar.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import {AppModule} from 'app.module'
import { RabbitMQService } from './rabbitmq.service';
// import { DatabaseConnection } from './database.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAvatar.name, schema: UserAvatarSchema },
    ]),
    HttpModule,
    ConfigModule,
    AppModule
  ],
  providers: [UsersService,RabbitMQService],
  controllers: [UsersController],
})
export class UsersModule {}
