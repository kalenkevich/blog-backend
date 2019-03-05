import { Field, InputType } from "type-graphql";
import { UserRole } from "../core/user/role";

@InputType()
export class UserSignInInput {
    @Field()
    public email: string;

    @Field()
    public password: string;
}

@InputType()
export class UserSignUpInput {
    @Field()
    public name: string;

    @Field()
    public email: string;

    @Field()
    public phone: string;

    @Field()
    public password: string;

    @Field()
    public role: UserRole;
}
