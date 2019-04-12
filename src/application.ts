import cors from "cors";
import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {Container, Inject, Service} from "typedi";
import {buildSchema} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import {PostgressConnector} from "./connector/database";
import {resolvers} from "./graphql";
import {UserRoles} from "./module/user/model";
import Logger from "./connector/logger";
import AuthConnector from "./connector/auth";

@Service()
export default class ApplicationServer {
  private settings: any;

  @Inject()
  private logger: Logger;

  @Inject()
  private dbConnector: PostgressConnector;

  @Inject()
  private authConnector: AuthConnector;

  private server: ApolloServer;

  private readonly app: Application;

  private readonly port: number;

  public constructor(@Inject("settings") settings: any) {
    this.settings = settings;
    this.port = process.env.PORT || settings.Port;
    this.app = express();

    this.registerBodyParsers(settings);
    this.configureHeaders(settings);
  }

  private registerBodyParsers(settings: any) {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser(settings.TokenSecret));
  }

  private configureHeaders(settings: any) {
    this.app.use(cors((req, callback) => {
      const currentClientOrigin = req.header("origin");
      const origin = (settings.AllowedClientOrigins || []).find((allowedOrigin: string) => allowedOrigin === currentClientOrigin);

      callback(null, {origin, credentials: true});
    }));
  }

  private async initServer() {
    this.app.set("port", this.port);

    const schema = await buildSchema({
      resolvers,
      authChecker: ({root, args, context, info}, roles: UserRoles[]) => {
        const {user} = context;

        return roles.indexOf(user.role) !== -1;
      },
    });

    this.server = new ApolloServer({
      schema,
      context: async ({req, res}) => {
        const {token} = req.cookies;
        const user = await this.authConnector.getUser(token);

        return {user, token, request: req, response: res};
      },
    });

    this.server.applyMiddleware({
      app: this.app,
      cors: false,
    });

    return this.app;
  }

  private async initDatabase() {
    await this.dbConnector.connect();

    Container.set("EntityManager", this.dbConnector.entityManager);
  }

  private async initAuth() {
    await this.authConnector.connect();
  }

  private async init() {
    try {
      await this.initDatabase();
      this.logger.info(`Database: Successfully connected to: ${this.settings.Database.host}.${this.settings.Database.database}`);
    } catch (error) {
      this.logger.error(`Database: Error while connecting: ${error.message}`);
    }

    try {
      await this.initAuth();
      this.logger.info(`Auth: Successfully connected to: ${this.settings.AuthUrl}`);
    } catch (error) {
      this.logger.error(`Auth: Error while connecting: ${error.message}`);
    }

    try {
      await this.initServer();
    } catch (error) {
      this.logger.error(`Server: Error while init: ${error.message}`);
    }

    return this;
  }

  public async run() {
    try {
      this.logger.info(`Server: Init...`);

      await this.init();

      this.app.listen(this.port, () => this.logger.info(`Server: Running on port: ${this.port}`));
    } catch (error) {
      this.logger.error(`Server: Error while starting: ${error.message}`);
    }
  }
}
