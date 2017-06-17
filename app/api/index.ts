import { Router } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../inversify/types';
import { container } from '../inversify/config';
import { IController } from './controller.interface';
import { LoggerInstance } from 'winston';
import {config} from '../config';

export const apiRouter = Router();
const controller = container.get<IController>(TYPES.Controller);
const logger = container.get<LoggerInstance>(TYPES.Logger);
const entityRouter = Router();

logger.verbose(`${config.microserviceEntityName.plural}::router:: initializing routes`);
entityRouter.get('/', controller.list.bind(controller));
entityRouter.get('/:id', controller.get.bind(controller));
entityRouter.post('/', controller.create.bind(controller));
entityRouter.put('/:id', controller.update.bind(controller));
entityRouter.delete('/:id', controller.delete.bind(controller));

apiRouter.use(`/${config.microserviceEntityName.plural}`, entityRouter);
logger.verbose(`${config.microserviceEntityName.plural}::router:: done initializing routes`);