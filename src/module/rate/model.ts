import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/model";
import {Post} from "../post/model";
import {Comment} from "../comment/model";

@Entity("post_rate_user_actions")
@ObjectType()
export class PostRateUserAction {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(type => User)
  @ManyToOne(type => User)
  @JoinColumn({name: "userId"})
  user: User;

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

  @Field(type => User)
  @ManyToOne(type => User)
  @JoinColumn({name: "userId"})
  user: User;

  @Field(type => Comment)
  @ManyToOne(type => Comment)
  @JoinColumn({name: "commentId"})
  comment: Comment;

  @Column()
  @Field()
  action: boolean;
}
