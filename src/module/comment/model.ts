import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/model";
import {Post} from "../post/model";
import {CommentRateUserAction} from "../rate/model";

@InputType()
export class CommentInput {
  @Field(type => ID, {nullable: true})
  id: number;

  @Field()
  content: string;
}

@ObjectType()
@Entity("comments")
export class Comment {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field()
  creationDate: Date;

  @Column({default: 0.0})
  @Field()
  rate: number;

  @Field(type => [CommentRateUserAction], {nullable: true})
  @OneToMany(type => CommentRateUserAction, userAction => userAction.comment, {nullable: true, onDelete: 'CASCADE'})
  ratedUsers: CommentRateUserAction[];

  @Field((type) => User)
  @ManyToOne((type) => User)
  author: User;

  @Column({type: "int", nullable: true})
  postId: number;

  @Field(type => Post)
  @ManyToOne(type => Post, post => post.comments)
  @JoinColumn({name: "postId"})
  post: Post;
}
