import { LoggerInstance } from 'winston';
import { Container } from 'inversify';
import { TYPES } from './types';
import { ICRUDHandler } from '../persistance/crud-handler.interface';
import { CRUDHandler } from '../persistance/crud-handler';
import { Controller } from '../api/controller';
import { IController } from '../api/controller.interface';
import { Case } from '../models/case.model';
import { logger } from '../logger';
import { DBHandler } from '../persistance/db-handler';
import { IDBHandler } from '../persistance/db-handler.interface';

export const container = new Container();

container.bind<LoggerInstance>(TYPES.Logger).toConstantValue(logger);
container.bind<IDBHandler>(TYPES.DBHandler).to(DBHandler);
container.bind<IController>(TYPES.Controller).to(Controller);
container.bind<ICRUDHandler<Case>>(TYPES.PersistanceHandler).toConstantValue(new CRUDHandler<Case>('cases'))

logger.info('inversify::initialization:: Dependencies initialized');