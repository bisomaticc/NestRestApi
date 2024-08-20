import { Connection } from 'mongoose';
export declare class DatabaseConnection {
    private readonly connection;
    constructor(connection: Connection);
    get Connection(): Connection;
}
