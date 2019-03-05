import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./role";

@InputType()
export class UserInput {
    @Field((type) => ID, { nullable: true })
    public id: string;

    @Field()
    public name: string;

    @Field()
    public email: string;

    @Field({ nullable: true })
    public phone: string;

    @Field({ nullable: true })
    public avatarUrl: string;
}

@Entity("users")
@ObjectType()
export class User {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    @Field()
    public name: string;

    @Column()
    @Field()
    public email: string;

    @Column()
    @Field()
    public phone: string;

    @Column()
    @Field((type) => [UserRole])
    public roles: UserRole[];

    @Column()
    public password: string;

    @Column({ default: true })
    public active: boolean;

    @Column({ nullable: true })
    public token: string;

    @Column({ default: "" })
    @Field()
    public avatarUrl: string;
}
