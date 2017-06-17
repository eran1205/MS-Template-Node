import { Db } from 'mongodb';

export interface IDBHandler {
    getConnection(): Db;
}