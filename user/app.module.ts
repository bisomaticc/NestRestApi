import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './src/config/config.module';
import { forwardRef } from '@nestjs/common';
import { UsersModule } from './src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnection } from './src/users/database.provider';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    forwardRef(() => UsersModule), // Use forwardRef to create a forward reference
  ],
  providers: [DatabaseConnection],
  exports: [DatabaseConnection],
})
export class AppModule {}