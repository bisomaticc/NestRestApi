import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { User } from './schemas/user.schema';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.configService.get<string>('RABBITMQ_URI'));
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue('user_created', { durable: true });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  async sendUserCreatedEvent(user: User) {
    if (!this.channel) {
      await this.connect();
    }

    const userBuffer = Buffer.from(JSON.stringify(user));

    this.channel.sendToQueue('user_created', userBuffer, {
      persistent: true,
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
