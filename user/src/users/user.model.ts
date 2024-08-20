import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseConnection } from './database.provider';
import { User, UserSchema } from './schemas/user.schema';

@Injectable()
export class UserModel {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & typeof UserSchema>,
    private readonly databaseConnection: DatabaseConnection,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<void> {
    return this.userModel.findByIdAndDelete(id);
  }
}