import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/model";
import {Category, CategoryInput} from "../category/model";
import {Comment} from "../comment/model";
import {PostRateUserAction} from "../rate/model";

@InputType()
export class PostInput {
  @Field(type => ID, {nullable: true})
  public id: number;

  @Field()
  public title: string;

  @Field()
  public content: string;

  @Field(type => [CategoryInput], {nullable: true})
  public categories: Category[];
}

@Entity("posts")
@ObjectType()
export class Post {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  @Field()
  title: string;

  @Column()
  @Field()
  content: string;

  @Field(type => User)
  @ManyToOne(type => User)
  author: User;

  @Column({default: 0.0})
  @Field()
  rate: number;

  @Field(type => [PostRateUserAction], {nullable: true})
  @OneToMany(type => PostRateUserAction, userAction => userAction.post, {nullable: true, onDelete: 'CASCADE'})
  ratedUsers: PostRateUserAction[];

  @Field(type => [Category], {nullable: true})
  @ManyToMany(type => Category, {nullable: true})
  @JoinTable()
  categories: Category[];

  @OneToMany(type => Comment, comment => comment.post, {nullable: true, onDelete: 'CASCADE'})
  @Field((type) => [Comment], {nullable: true})
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

  @Field(type => [PostRateUserAction], {nullable: true})
  ratedUsers: PostRateUserAction[];

  @Field(type => [Category], {nullable: true})
  categories: Category[];

  @Field()
  commentsCount: number;

  @Field()
  creationDate: Date;
}
