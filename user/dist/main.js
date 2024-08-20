"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const users_module_1 = require("./src/users/users.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(users_module_1.UsersModule);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map