import { Inject, Service } from "typedi";
import {Connection, ContainedType, createConnection, EntityManager} from "typeorm";
import DatabaseConnectorInterface from "./interface";
import entities from './entities';

@Service()
export default class MongoDBConnector implements DatabaseConnectorInterface {
    @Inject("settings")
    settings: any;

    connection: Connection;

    entityManager: EntityManager;

    public async connect() {
        const settings = this.settings;

        this.connection = await createConnection({
            type: "mongodb",
            url: settings.Database.Url,
            entities,
            extra: {
                timezone: "utc",
            },
            synchronize: true,
            logging: false,
            useNewUrlParser: true,
        });

        this.entityManager = new EntityManager(this.connection);

        return this.connection;
    }
}
