import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Location, LocationInput } from "./model";

@Service("LocationService")
export class LocationService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public getLocation(locationInput: LocationInput): Promise<Location> {
        return this.entityManager.findOne(Location, { city: locationInput.city });
    }

    public getAllLocations(): Promise<Location[]> {
        return this.entityManager.find(Location);
    }

    public addLocation(location: LocationInput) {
        return this.entityManager.save(Location, location);
    }
}
