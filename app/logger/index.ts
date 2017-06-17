import { config } from '../config';
import * as winston from 'winston';

export const logger = new winston.Logger(config.logger);