import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/model";
import {Post} from "../post/model";

@InputType()
export class CommentInput implements Partial<Comment> {
    @Field(type => ID, { nullable: true })
    id: string;

    @Field()
    content: string;
}

@ObjectType()
@Entity("comment")
export class Comment {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    @Field()
    content: string;

    @Column()
    @Field()
    creationDate: Date;

    @Column()
    @Field()
    rate: number;

    @Field((type) => User)
    @ManyToOne((type) => User)
    author: User;

    @Field(type => Post)
    @ManyToOne(type => Post, post => post.comments, { nullable: true })
    post: Post;
}
