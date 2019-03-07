import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@InputType()
export class CategoryInput implements Partial<Category> {
    @Column()
    @Field()
    public value: string;

    @Column()
    @Field({ nullable: true })
    public nameKey: string;
}

@Entity("categories")
@ObjectType()
export class Category {
    @PrimaryColumn()
    @Field()
    public value: string;

    @Column()
    @Field()
    public nameKey: string;
}
