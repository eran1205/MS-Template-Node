import * as winston from 'winston';

export interface Config {
    msPort: number;
    microserviceEntityName: {
        single: string;
        plural: string;
        miscroserviceType: any;
    }
    db: {
        connectionString: string;
    };
    logger: {
        transports?: winston.TransportInstance[];
    }
    complexPropertyQueryParamDelimiter: string;
}