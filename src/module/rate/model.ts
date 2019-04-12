import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Post} from "../post/model";
import {Comment} from "../comment/model";

@Entity("post_rate_user_actions")
@ObjectType()
export class PostRateUserAction {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  userId: number;

  @Field(type => Post)
  @ManyToOne(type => Post)
  @JoinColumn({name: "postId"})
  post: Post;

  @Column()
  @Field()
  action: boolean;
}

@Entity("comment_rate_user_actions")
@ObjectType()
export class CommentRateUserAction {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  userId: number;

  @Field(type => Comment)
  @ManyToOne(type => Comment)
  @JoinColumn({name: "commentId"})
  comment: Comment;

  @Column()
  @Field()
  action: boolean;
}
