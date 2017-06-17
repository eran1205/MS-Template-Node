import 'reflect-metadata';
import { injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import { LoggerInstance } from 'winston';
import { ICRUDHandler } from './crud-handler.interface';
import { IDBHandler } from './db-handler.interface';
import { TYPES } from '../inversify/types';
import { container } from '../inversify/config';
import { config } from '../config';

@injectable()
export class CRUDHandler<Model> implements ICRUDHandler<Model> {
    private dbHandler: IDBHandler;
    private logger: LoggerInstance;
    constructor(private collectionName: string) {
        this.dbHandler = container.get<IDBHandler>(TYPES.DBHandler);
        this.logger = container.get<LoggerInstance>(TYPES.Logger);
    }

    async list(queryParams?: { [id: string]: string }): Promise<Model[]> {
        try {
            const mongoQuery = this.buildMongoFilterObjectFromQuery(queryParams);

            this.logger.info(`${config.microserviceEntityName.plural}::CRUDHandler::list:: request received, fetching from DB`);
            const connection = this.dbHandler.getConnection();
            const listDBResponse = await connection.collection(config.microserviceEntityName.plural).find(mongoQuery).toArray();
            this.logger.verbose(`${config.microserviceEntityName.plural}::CRUDHandler::list:: feched listDBResponseponse: ${JSON.stringify(listDBResponse)}`);

            return listDBResponse;
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::CRUDHandler::list:: error fetching list from DB: ${ex}`);
            throw ex;
        }
    }
    async getById(id: string): Promise<Model> {
        try {
            // TODO: handle wrong id conversion and return reasonable error
            const mongoId = new ObjectID(id);

            this.logger.info(`${config.microserviceEntityName.plural}::CRUDHandler::getById:: request received, fetching from DB`);
            const connection = this.dbHandler.getConnection();
            const getByIdResponse = await connection.collection(config.microserviceEntityName.plural).findOne({ _id: mongoId });
            this.logger.verbose(`${config.microserviceEntityName.plural}::CRUDHandler::getById:: feched getByIdResponse: ${JSON.stringify(getByIdResponse)}`);

            return getByIdResponse;
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::CRUDHandler::getById:: error fetching getById from DB: ${ex}`);
            throw ex;
        }
    }
    async add(instance: Model): Promise<Model> {
        try {
            this.logger.info(`${config.microserviceEntityName.plural}::CRUDHandler::add:: request received, writing to DB`);
            const connection = this.dbHandler.getConnection();
            const insertResponse = await connection.collection(config.microserviceEntityName.plural).insertOne(instance);

            const newDocument = await this.getById(insertResponse.insertedId.toHexString());
            this.logger.verbose(`${config.microserviceEntityName.plural}::CRUDHandler::add:: inserted to DB :${JSON.stringify(newDocument)}`);

            return newDocument;
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::CRUDHandler::add:: error insert to DB: ${ex}`);
            throw ex;
        }
    }
    async update(id: string, instance: Model): Promise<Model> {
        try {
            // TODO: handle wrong id conversion and return reasonable error
            const mongoId = new ObjectID(id);

            this.logger.info(`${config.microserviceEntityName.plural}::CRUDHandler::update:: request received, updating DB`);
            const connection = this.dbHandler.getConnection();
            const insertReponse = await connection.collection(config.microserviceEntityName.plural).updateOne({ _id: mongoId }, instance);

            const updatedDocument = await this.getById(id);
            this.logger.verbose(`${config.microserviceEntityName.plural}::CRUDHandler::update:: updated DB :${JSON.stringify(updatedDocument)}`);

            return updatedDocument;
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::CRUDHandler::update:: error update DB: ${ex}`);
            throw ex;
        }
    }
    async delete(id: string): Promise<number> {
        try {
            // TODO: handle wrong id conversion and return reasonable error
            const mongoId = new ObjectID(id);

            this.logger.info(`${config.microserviceEntityName.plural}::CRUDHandler::delete:: request received, removing from DB`);
            const connection = this.dbHandler.getConnection();
            const deleteResponse = await connection.collection(config.microserviceEntityName.plural).deleteOne({ _id: mongoId });
            this.logger.verbose(`${config.microserviceEntityName.plural}::CRUDHandler::delete:: removed ${deleteResponse.deletedCount} documents`);

            return deleteResponse.deletedCount;
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::CRUDHandler::delete:: error removing document from DB: ${ex}`);
            throw ex;
        }
    }

    private buildMongoFilterObjectFromQuery(query: { [id: string]: string }): { [id: string]: string } {
        return query;
    }
}