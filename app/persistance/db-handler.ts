import * as mongo from 'mongodb';
import { LoggerInstance } from 'winston';
import { IDBHandler } from './db-handler.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify/types';
import { config } from '../config'

@injectable()
export class DBHandler implements IDBHandler {
    private connection: mongo.Db;

    constructor( @inject(TYPES.Logger) private logger: LoggerInstance) {
        const client = new mongo.MongoClient();
        logger.info(`persistance::connection:: initiating DB connection to: ${config.db.connectionString}`);
        client.connect(config.db.connectionString, (err, db) => {
            if (err) {
                this.logger.error(`persistance::connection:: error connecting to db, ${err.message}, CODE: ${err.code}`);
                throw err;
            }
            logger.info(`persistance::connection:: connection initiated successfully`);
            this.connection = db;
        });
    }

    getConnection() {
        return this.connection;
    }
}