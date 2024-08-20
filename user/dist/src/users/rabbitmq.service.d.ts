import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './schemas/user.schema';
export declare class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private connection;
    private channel;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    connect(): Promise<void>;
    sendUserCreatedEvent(user: User): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
