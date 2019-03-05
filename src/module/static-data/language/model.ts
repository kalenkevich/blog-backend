import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType()
export class LanguageInput {
    @Field({ nullable: true })
    public nameKey: string;

    @Field()
    public value: string;
}

@Entity("languages")
@ObjectType()
export class Language {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    @Field()
    public nameKey: string;

    @Column()
    @Field()
    public value: string;
}
