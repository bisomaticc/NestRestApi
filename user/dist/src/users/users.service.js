"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const user_schema_1 = require("./schemas/user.schema");
const user_avatar_schema_1 = require("./schemas/user-avatar.schema");
const rabbitmq_service_1 = require("./rabbitmq.service");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
let UsersService = class UsersService {
    constructor(userModel, userAvatarModel, rabbitMQService, httpService) {
        this.userModel = userModel;
        this.userAvatarModel = userAvatarModel;
        this.rabbitMQService = rabbitMQService;
        this.httpService = httpService;
        this.avatarsTempDir = path.join(__dirname, '../../temp_avatars');
        if (!fs.existsSync(this.avatarsTempDir)) {
            fs.mkdirSync(this.avatarsTempDir);
        }
    }
    async createUser(name, job) {
        const newUser = new this.userModel({ name, job });
        await newUser.save();
        await this.rabbitMQService.sendUserCreatedEvent(newUser);
        return newUser;
    }
    async getUserFromReqRes(userId) {
        const response = await this.httpService.get(`https://reqres.in/api/users/${userId}`).toPromise();
        return response.data.data;
    }
    async getUserAvatar(userId) {
        const existingAvatar = await this.userAvatarModel.findOne({ userId });
        if (existingAvatar) {
            const avatarData = fs.readFileSync(existingAvatar.filePath);
            return avatarData.toString('base64');
        }
        const user = await this.getUserFromReqRes(userId);
        const avatarUrl = user.avatar;
        try {
            const avatarResponse = await this.httpService.get(avatarUrl, { responseType: 'arraybuffer' }).toPromise();
            const avatarBuffer = Buffer.from(avatarResponse.data);
            const avatarHash = crypto.createHash('md5').update(avatarBuffer).digest('hex');
            const filePath = path.join(this.avatarsTempDir, `${avatarHash}.png`);
            fs.writeFileSync(filePath, avatarBuffer);
            const newAvatar = new this.userAvatarModel({ userId, avatarHash, filePath });
            await newAvatar.save();
            return avatarBuffer.toString('base64');
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                console.error(`Avatar image not found: ${avatarUrl}`);
                return 'default-avatar-base64-encoded-string';
            }
            else {
                console.error(`Error retrieving avatar image: ${error.message}`);
                return 'default-avatar-base64-encoded-string';
            }
        }
    }
    async deleteUserAvatar(userId) {
        const avatar = await this.userAvatarModel.findOneAndDelete({ userId });
        if (avatar && fs.existsSync(avatar.filePath)) {
            fs.unlinkSync(avatar.filePath);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_avatar_schema_1.UserAvatar.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        rabbitmq_service_1.RabbitMQService,
        axios_1.HttpService])
], UsersService);
//# sourceMappingURL=users.service.js.map