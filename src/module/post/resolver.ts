import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { Post, PostInput } from "./model";
import { User } from "../user/model";
import PostService from "./service";
import Logger from "../../connector/logger";
import {CommentInput} from "../comment/model";
import OperationResult from "../operation/operation-result";
import CommentService from "../comment/service";

@Resolver(Post)
export default class PostResolver {
    @Inject()
    private postService: PostService;

    @Inject()
    private commentService: CommentService;

    @Inject()
    private logger: Logger;

    @Query((returns) => [Post], { nullable: true })
    public async getAllPosts(@Ctx("user") user: User) {
        try {
            const result = await this.postService.getAllPosts();

            this.logger.trace(`Successfully fetched all posts for user: ${user.id} ${user.email}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => Post)
    public async getPost(@Ctx("user") user: User, @Arg("postId") postId: string) {
        try {
            const result = await this.postService.getPost(postId);

            this.logger.trace(`Successfully fetched post for user: ${user.id} ${user.email}`);

            return result;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => Post)
    public async createPost(@Ctx("user") user: User, @Arg("post") post: PostInput) {
        try {
            const createdPost = await this.postService.createPost(post);

            this.logger.trace(`Successfully created post: ${createdPost.id} by user: ${user.id} ${user.email}`);

            return createdPost;
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => Post)
    public async updatePost(@Ctx("user") user: User, @Arg("post") post: PostInput) {
        try {
            await this.postService.updatePost(post);

            this.logger.trace(`Successfully updated post: ${post.id} by user: ${user.id} ${user.email}`);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async deletePost(@Ctx("user") user: User, @Arg("postId") postId: string) {
        try {
            await this.postService.deletePost(postId);

            this.logger.trace(`Successfully deleted post: ${postId} by user: ${user.id} ${user.email}`);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async addComment(@Ctx("user") user: User, @Arg("postId") postId: string, @Arg("comment") comment: CommentInput) {
        try {
            const createdComment = await this.postService.addComment(postId, comment);

            this.logger.trace(`Successfully added comment: ${createdComment.id} for post: ${postId} by user: ${user.id} ${user.email}`);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async updateComment(@Ctx("user") user: User, @Arg("comment") comment: CommentInput) {
        try {
            await this.commentService.updateComment(comment);

            this.logger.trace(`Successfully updates comment: ${comment.id} by user: ${user.id} ${user.email}`);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => OperationResult)
    public async deleteComment(@Ctx("user") user: User, @Arg("commentId") commentId: string) {
        try {
            await this.commentService.deleteComment(commentId);

            this.logger.trace(`Successfully deleted comment: ${commentId} by user: ${user.id} ${user.email}`);

            return OperationResult.createSuccessResult();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
