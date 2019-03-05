import { Field, ID, InputType, ObjectType } from "type-graphql";
import {Column, Entity, ManyToMany, ObjectID, ObjectIdColumn} from "typeorm";
import { User } from "../user/model";
import { Category, CategoryInput } from "../static-data/category/model";
import { Comment } from "../comment/model";

@InputType()
export class PostInput implements Partial<Post> {
    @Field(type => ID, { nullable: true })
    public id: ObjectID;

    @Field()
    public title: string;

    @Field()
    public content: string;

    @Field(type => [CategoryInput])
    public categories: Category[];
}

@Entity("post")
@ObjectType()
export class Post {
    @Field((type) => ID)
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field()
    content: string;

    @Column(type => User)
    @Field(type => User)
    user: User;

    @Column()
    @Field({ defaultValue: 3.0 })
    rate: number;

    @ManyToMany(type => Category)
    @Field(type => [Category])
    categories: Category[];

    @Column({ nullable: true })
    @Field((type) => [Comment], { nullable: true })
    comments?: Comment[];

    @Column()
    @Field()
    creationDate: Date;
}
