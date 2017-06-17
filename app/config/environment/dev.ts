import * as winston from 'winston';
import { Config } from './config.model';
import { Case } from '../../models/case.model';

export const config: Config = {
    msPort: 3000,
    microserviceEntityName: {
        single: 'case',
        plural: 'cases',
        miscroserviceType: Case
    },
    db: {
        connectionString: 'mongodb://eran1205:dhbdh123@ds155160.mlab.com:55160/myserver'
    },
    logger: {
        transports: [
            new winston.transports.Console({
                level: 'verbose'
            }),
            new winston.transports.File({
                name: 'all',
                filename: 'all.log'
            }),
            new winston.transports.File({
                name: 'errors',
                filename: 'errors.log',
                level: 'error',
            })
        ]
    },
    complexPropertyQueryParamDelimiter: '.'
}