import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseConnection {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  get Connection(): Connection {
    return this.connection;
  }
}