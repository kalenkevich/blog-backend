import {Field, ID, ObjectType, registerEnumType} from "type-graphql";

export enum UserApplications {
  AUTH = 'AUTH',
  BLOG = 'BLOG',
  HOLIDAY = 'HOLIDAY',
}

export enum UserRoles {
  ZENVO_ADMIN = 'ZENVO_ADMIN', // admin user role across the Zenvo apps (highest role priority)
  ZENVO_MANAGER = 'ZENVO_MANAGER', // manager user role across the Zenvo apps
  ZENVO_USER = 'ZENVO_USER', // primary user role across the Zenvo apps (lowest role priority)
  ZENVO_BLOG_ADMIN = 'ZENVO_BLOG_ADMIN', // admin user role only for Zenvo.Blog
  ZENVO_BLOG_MANAGER = 'ZENVO_BLOG_MANAGER', // manager user role only for Zenvo.Blog
  ZENVO_HOLIDAY_ADMIN = 'ZENVO_HOLIDAY_ADMIN', // admin user role only for Zenvo.Holiday
  ZENVO_HOLIDAY_MANAGER = 'ZENVO_HOLIDAY_MANAGER', // manager user role only for Zenvo.Holiday
}

registerEnumType(UserRoles, {
  name: "UserRoles",
});

registerEnumType(UserApplications, {
  name: "UserApplications",
});

@ObjectType()
export class User {
  @Field((type) => ID)
  public id: number;

  @Field()
  public name: string;

  @Field()
  public email: string;

  @Field({nullable: true})
  public phone: string;

  @Field((type) => [UserRoles])
  public roles: string[];

  @Field((type) => [UserApplications])
  public applications: string[];

  @Field({defaultValue: ""})
  public avatarUrl: string;
}
