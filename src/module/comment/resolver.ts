import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { User } from "../user/model";
import { Comment, CommentInput } from "./model";
import OperationResult from "../operation/operation-result";
import CommentService from "../comment/service";
import Logger from "../../connector/logger";

@Resolver(Comment)
export default class CommentResolver {
    @Inject()
    private commentService: CommentService;

    @Inject()
    private logger: Logger;

    @Mutation((returns) => OperationResult)
    public async updateComment(@Ctx("user") user: User, @Arg("comment") comment: CommentInput) {
        try {
            await this.commentService.updateComment(comment);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async deleteComment(@Ctx("user") user: User, @Arg("commentId") commentId: number) {
        try {
            await this.commentService.deleteComment(commentId);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async rateComment(@Ctx("user") user: User, @Arg("commentId") commentId: number, @Arg("rateAction") rateAction: string) {
        try {
            await this.commentService.rateComment(user, commentId, rateAction);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
