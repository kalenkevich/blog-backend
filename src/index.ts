import "reflect-metadata";
import { useContainer } from "type-graphql";
import { Container } from "typedi";
import ApplicationServer from "./application";
import settings from "../config/settings";

Container.set("settings", settings);

useContainer(Container);

(async () => {
    const server = Container.get(ApplicationServer);

    return server.run();
})();
