export interface ICRUDHandler<Model> {
    list(queryParams?: { [id: string]: string }): Promise<Model[]>;
    getById(id: string): Promise<Model>;
    add(instance: Model): Promise<Model>;
    update(id: string, instance: Model): Promise<Model>;
    delete(id: string): Promise<number>;
}