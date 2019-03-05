import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerProfile } from "../../customer/profile/model";
import { ContractorProfile } from "../profile/model";

@InputType()
export class ReviewInput implements Partial<Review> {
    @Field()
    public content: string;
}

@ObjectType()
@Entity("reviews")
export class Review {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Field()
    public content: string;

    @Column()
    @Field()
    public date: Date;

    @Field((type) => CustomerProfile)
    @ManyToOne((type) => CustomerProfile)
    public owner: CustomerProfile;

    @ManyToOne((type) => ContractorProfile, (profile) => profile.reviews)
    public profile: ContractorProfile;
}
