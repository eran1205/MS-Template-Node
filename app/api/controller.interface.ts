import { Request, Response } from 'express';

export interface IController {
    list(request: Request, response: Response): void;
    get(request: Request, response: Response): void;
    create(request: Request, response: Response): void;
    update(request: Request, response: Response): void;
    delete(request: Request, response: Response): void;
}