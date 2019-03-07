import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/model";
import { Category, CategoryInput } from "../category/model";
import { Comment } from "../comment/model";

@InputType()
export class PostInput {
    @Field(type => ID, { nullable: true })
    public id: number;

    @Field()
    public title: string;

    @Field()
    public content: string;

    @Field(type => [CategoryInput])
    public categories: Category[];
}

@Entity("posts")
@ObjectType()
export class Post {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field()
    content: string;

    @Field(type => User)
    @ManyToOne(type => User, { cascade: true })
    author: User;

    @Column({ default: 0.0 })
    @Field()
    rate: number;

    @ManyToMany(type => Category)
    @Field(type => [Category], { nullable: true })
    categories: Category[];

    @ManyToOne(type => Comment, comment => comment.post, { nullable: true })
    @Field((type) => [Comment], { nullable: true })
    comments?: Comment[];

    @Column()
    @Field()
    creationDate: Date;
}

@ObjectType()
export class PostPreview {
    @Field((type) => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    contentPreview: string;

    @Field(type => User)
    author: User;

    @Field()
    rate: number;

    @Field(type => [Category], { nullable: true })
    categories: Category[];

    @Field()
    commentsCount: number;

    @Field()
    creationDate: Date;
}
