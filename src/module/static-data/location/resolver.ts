import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import Logger from "../../../connector/logger";
import { Location, LocationInput } from "./model";
import { LocationService } from "./service";

@Resolver(Location)
export default class LocationResolver {
    @Inject()
    public locationService: LocationService;

    @Inject()
    public logger: Logger;

    @Query((returns) => [Location])
    public async getAllLocation() {
        try {
            const result = await this.locationService.getAllLocations();

            this.logger.info(`Successfully fetched all locations`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => [Location])
    public async addLocation(@Arg("location") location: LocationInput) {
        try {
            const result = await this.locationService.addLocation(location);

            this.logger.info(`Successfully added new location: ${result.latitude} ${result.longitude}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
