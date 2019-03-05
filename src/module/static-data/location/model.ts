import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType()
export class LocationInput implements Partial<Location> {
    @Field({ nullable: true })
    public name: string;

    @Field({ nullable: true })
    public streetAddress: string;

    @Field({ nullable: true })
    public zipCode: string;

    @Field()
    public city: string;

    @Field({ nullable: true })
    public region: string;

    @Field({ nullable: true })
    public state: string;

    @Field({ nullable: true })
    public country: string;

    @Field({ nullable: true })
    public latitude: string;

    @Field({ nullable: true })
    public longitude: string;
}

@Entity("locations")
@ObjectType()
export class Location {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Field()
    public name: string;

    @Column()
    @Field()
    public streetAddress: string;

    @Column()
    @Field()
    public zipCode: string;

    @Column()
    @Field()
    public city: string;

    @Column()
    @Field()
    public region: string;

    @Column()
    @Field()
    public state: string;

    @Column()
    @Field()
    public country: string;

    @Column()
    @Field()
    public latitude: string;

    @Column()
    @Field()
    public longitude: string;
}
