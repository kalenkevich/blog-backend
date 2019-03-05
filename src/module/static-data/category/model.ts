import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType()
export class CategoryInput implements Partial<Category> {
    @Column()
    @Field()
    public value: string;

    @Column()
    @Field()
    public nameKey: string;
}

@Entity("categories")
@ObjectType()
export class Category {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Field()
    public value: string;

    @Column()
    @Field()
    public nameKey: string;
}
