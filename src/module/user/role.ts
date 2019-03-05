import { registerEnumType } from "type-graphql";

export enum UserRole {
    admin = "admin",
    user = "user",
    moderator = "moderator",
}

registerEnumType(UserRole, { name: "UserRole" });
