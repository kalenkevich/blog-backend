import { Connection, EntityManager } from "typeorm";

export default interface IDatabaseConnector {
    config: any;
    connection: Connection;
    entityManager: EntityManager;
    connect(): Promise<any>;
}
