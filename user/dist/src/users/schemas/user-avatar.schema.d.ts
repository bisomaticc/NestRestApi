import { Document } from 'mongoose';
export declare class UserAvatar extends Document {
    userId: string;
    avatarHash: string;
    filePath: string;
}
export declare const UserAvatarSchema: import("mongoose").Schema<UserAvatar, import("mongoose").Model<UserAvatar, any, any, any, Document<unknown, any, UserAvatar> & UserAvatar & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserAvatar, Document<unknown, {}, import("mongoose").FlatRecord<UserAvatar>> & import("mongoose").FlatRecord<UserAvatar> & Required<{
    _id: unknown;
}>>;
