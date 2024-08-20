import { Model } from 'mongoose';
import { DatabaseConnection } from './database.provider';
import { User, UserSchema } from './schemas/user.schema';
export declare class UserModel {
    private readonly userModel;
    private readonly databaseConnection;
    constructor(userModel: Model<User & typeof UserSchema>, databaseConnection: DatabaseConnection);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(user: User): Promise<User>;
    update(id: string, user: User): Promise<User>;
    delete(id: string): Promise<void>;
}
