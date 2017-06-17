export interface IQueryParamParser {
    // TODO: TBD what is the return type of this function should be
    parse(queries: { [is: string]: string }): object;
}