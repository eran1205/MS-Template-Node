import 'reflect-metadata';
import { LoggerInstance } from 'winston';
import { IController } from './controller.interface';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../inversify/types';
import { ICRUDHandler } from '../persistance/crud-handler.interface';
import { config } from '../config';
import { HttpError } from '../models/http-error.model'
@injectable()
export class Controller implements IController {
    constructor(
        @inject(TYPES.PersistanceHandler) private persistanceHandler: ICRUDHandler<object>,
        @inject(TYPES.Logger) private logger: LoggerInstance) { }

    async list(request: Request, response: Response) {
        try {
            this.logger.info(`${config.microserviceEntityName.plural}::controller::list: requested`);
            let listDBResponse = await this.persistanceHandler.list(request.query);
            response.json(listDBResponse);
            this.logger.info(`${config.microserviceEntityName.plural}::controller::list: response sent`);
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::controller::list: internal error: ${ex}`);
            response.status(500).send(new HttpError('ServerError').toString());
        }
    }

    async get(request: Request, response: Response) {
        try {
            const id = request.params.id;
            this.logger.info(`${config.microserviceEntityName.plural}::controller::get: requested with id: ${id}`);
            let getByIdDBResponse = await this.persistanceHandler.getById(id);

            if (!getByIdDBResponse) {
                this.logger.info(`${config.microserviceEntityName.plural}::controller::get: document not found with id: ${id}`);
                response.status(404).end();
                return;
            }

            response.json(getByIdDBResponse);
            this.logger.info(`${config.microserviceEntityName.plural}::controller::get: response sent`);
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::controller::get: internal error: ${ex}`);
            response.status(500).send(new HttpError('ServerError').toString());
        }
    }

    async create(request: Request, response: Response) {
        try {
            const newResource = request.body;

            this.logger.info(`${config.microserviceEntityName.plural}::controller::create: requested`);
            let newDocument = await this.persistanceHandler.add(newResource);
            response.status(201).json(newDocument);
            this.logger.info(`${config.microserviceEntityName.plural}::controller::create: response sent`);
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::controller::create: internal error: ${ex}`);
            response.status(500).send(new HttpError('ServerError').toString());
        }
    }

    async update(request: Request, response: Response) {
        try {
            const id = request.params.id;
            const objectToUpdate = request.body;

            this.logger.info(`${config.microserviceEntityName.plural}::controller::update: requested with id: ${id}`);
            let updatedDocument = await this.persistanceHandler.update(id, objectToUpdate);
            response.json(updatedDocument);
            this.logger.info(`${config.microserviceEntityName.plural}::controller::update: response sent`);
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::controller::update: internal error: ${ex}`);
            response.status(500).send(new HttpError('ServerError').toString());
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const id = request.params.id;
            this.logger.info(`${config.microserviceEntityName.plural}::controller::delete: requested with id: ${id}`);
            let removedCount = await this.persistanceHandler.delete(id);

            if (removedCount === 0) {
                this.logger.info(`${config.microserviceEntityName.plural}::controller::delete: document not found with id: ${id}`);
                response.status(404).end();
                return;
            }

            response.status(204).end();
            this.logger.info(`${config.microserviceEntityName.plural}::controller::delete: response sent`);
        } catch (ex) {
            this.logger.error(`${config.microserviceEntityName.plural}::controller::delete: internal error: ${ex}`);
            response.status(500).send(new HttpError('ServerError').toString());
        }
    }
}