import { ApolloError } from "apollo-error";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import Logger from "../../connector/logger";
import { SlackService } from "../../connector/slack";
import { User } from "../core/user/model";
import { UserSignInInput, UserSignUpInput } from "./model";
import AuthorizationService from "./service";

@Resolver(User)
export default class AuthorizationResolver {
    @Inject("AuthorizationService")
    public authorizationService: AuthorizationService;

    @Inject("Logger")
    public logger: Logger;

    @Inject("SlackService")
    public slackService: SlackService;

    @Mutation((returns) => User)
    public async signIn(@Arg("signInData") signInData: UserSignInInput, @Ctx("response") res) {
        try {
            const user = await this.authorizationService.signIn(signInData);

            res.cookie("token", user.token);

            this.logger.info(`User ${signInData.email} was successfully signed in to the system`);

            return user;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => User)
    public async signUp(@Arg("signUpData") signUpData: UserSignUpInput, @Ctx("response") res) {
        try {
            const user = await this.authorizationService.signUp(signUpData);

            res.cookie("token", user.token);

            this.logger.info(`User ${user.email} was successfully signed up to the system`);

            return user;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => User)
    public async authorize(@Ctx("request") req) {
        try {
            const { token } = req.cookies;
            const user = await this.authorizationService.authenticate(token);

            this.logger.info(`User ${user.email} was successfully authorized in the system`);

            return user;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => Boolean)
    public async signOut(@Ctx("token") token, @Ctx("response") res) {
        try {
            await this.authorizationService.signOut(token);

            res.clearCookie("token");

            this.logger.info(`User was signed out with token: ${token}`);

            return true;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
