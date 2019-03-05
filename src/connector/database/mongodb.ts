import { Service } from "typedi";
import { Connection, createConnection, EntityManager } from "typeorm";
import DatabaseConnectorInterface from "./interface";


@Service("PostgresDBConnector")
export default class PostgresDBConnector implements DatabaseConnectorInterface {
    public config: any;
    public connection: Connection;
    public entityManager: EntityManager;

    constructor(config) {
        this.config = config;
    }

    public async connect() {
        const config = this.config;

        this.connection = await createConnection({
            type: "postgres",
            url: config.url,
            entities: [
                Location,
                ContractorProfile,
                UserProfile,
                CustomerProfile,
                Event,
                Order,
                OrderMetadata,
                Price,
                Currency,
                EventType,
                Content,
                ScheduleItem,
                Statistics,
            ],
            extra: {
                ssl: process.env.ENVIRONMENT !== "local",
                timezone: "utc",
            },
            synchronize: true,
            logging: false,
        });

        this.entityManager = new EntityManager(this.connection);

        return this.connection;
    }
}
