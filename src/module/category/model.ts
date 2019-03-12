import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
    @PrimaryGeneratedColumn()
    @Field((type) => ID)
    public id: number;

    @Column()
    @Field()
    @Index({ unique: true })
    public value: string;
}
