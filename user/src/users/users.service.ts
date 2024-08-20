import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { User } from './schemas/user.schema';
import { UserAvatar } from './schemas/user-avatar.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { RabbitMQService } from './rabbitmq.service';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly avatarsTempDir = path.join(__dirname, '../../temp_avatars');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserAvatar.name) private userAvatarModel: Model<UserAvatar>,
    // private mailerService: MailerService,
    private rabbitMQService: RabbitMQService,
    private httpService: HttpService,
    // private configService: ConfigService, 
  ) {
    // Ensure the temporary directory exists
    if (!fs.existsSync(this.avatarsTempDir)) {
      fs.mkdirSync(this.avatarsTempDir);
    }
  }

  async createUser(name: string, job: string): Promise<User> {
    const newUser = new this.userModel({ name, job });
    await newUser.save();

    // Dummy email sending commneted for now
    // await this.mailerService.sendMail({
    //   to: 'user@example.com',
    //   subject: 'Welcome!',
    //   text: 'Your account has been created.',
    // });

    // Dummy RabbitMQ event
    await this.rabbitMQService.sendUserCreatedEvent(newUser);

    return newUser;
  }

  async getUserFromReqRes(userId: string): Promise<any> {
    const response: AxiosResponse<any> = await this.httpService.get(`https://reqres.in/api/users/${userId}`).toPromise();
    return response.data.data;
  }
async getUserAvatar(userId: string): Promise<string> {
  const existingAvatar = await this.userAvatarModel.findOne({ userId });
  if (existingAvatar) {
    const avatarData = fs.readFileSync(existingAvatar.filePath);
    return avatarData.toString('base64');
  }

  const user = await this.getUserFromReqRes(userId);
  const avatarUrl = user.avatar;

  try {
    const avatarResponse: AxiosResponse<Buffer> = await this.httpService.get(avatarUrl, { responseType: 'arraybuffer' }).toPromise();
    const avatarBuffer = Buffer.from(avatarResponse.data);

    const avatarHash = crypto.createHash('md5').update(avatarBuffer).digest('hex');
    const filePath = path.join(this.avatarsTempDir, `${avatarHash}.png`);
    fs.writeFileSync(filePath, avatarBuffer);

    const newAvatar = new this.userAvatarModel({ userId, avatarHash, filePath });
    await newAvatar.save();

    return avatarBuffer.toString('base64');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Avatar image not found: ${avatarUrl}`);
      // Return a default avatar or throw an error
      return 'default-avatar-base64-encoded-string'; // Replace with your default avatar
    } else {
      console.error(`Error retrieving avatar image: ${error.message}`);
      // Return a default avatar or throw an error
      return 'default-avatar-base64-encoded-string'; // Replace with your default avatar
    }
  }
}

  async deleteUserAvatar(userId: string): Promise<void> {
    const avatar = await this.userAvatarModel.findOneAndDelete({ userId });
    if (avatar && fs.existsSync(avatar.filePath)) {
      fs.unlinkSync(avatar.filePath);
    }
  }
}
