import { injectable } from 'inversify';
import { IQueryParamParser } from './query-param-parser.interface';

@injectable()
export class QueryParamParser implements IQueryParamParser {
    parse(queries: { [is: string]: string }): object {
        
        throw new Error('Not implemented');
    }
}