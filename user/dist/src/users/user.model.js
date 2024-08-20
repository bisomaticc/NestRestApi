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
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const database_provider_1 = require("./database.provider");
const user_schema_1 = require("./schemas/user.schema");
let UserModel = class UserModel {
    constructor(userModel, databaseConnection) {
        this.userModel = userModel;
        this.databaseConnection = databaseConnection;
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findOne(id) {
        return this.userModel.findOne({ _id: id }).exec();
    }
    async create(user) {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }
    async update(id, user) {
        return this.userModel.findByIdAndUpdate(id, user, { new: true });
    }
    async delete(id) {
        return this.userModel.findByIdAndDelete(id);
    }
};
exports.UserModel = UserModel;
exports.UserModel = UserModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        database_provider_1.DatabaseConnection])
], UserModel);
//# sourceMappingURL=user.model.js.map