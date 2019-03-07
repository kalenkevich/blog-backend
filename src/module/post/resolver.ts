import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { ObjectID } from "typeorm";
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
    public async getAllPosts() {
        try {
            return this.postService.getAllPosts();
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => Post)
    public async getPost(@Arg("postId") postId: number) {
        try {
            return this.postService.getPost(postId);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => Post)
    public async createPost(@Ctx("user") user: User, @Arg("post") post: PostInput) {
        try {
            const createdPost = await this.postService.createPost(post, user);

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
    public async deletePost(@Ctx("user") user: User, @Arg("postId") postId: number) {
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
    public async addComment(@Ctx("user") user: User, @Arg("postId") postId: number, @Arg("comment") comment: CommentInput) {
        try {
            const createdComment = await this.postService.addComment(postId, comment);

            this.logger.trace(`Successfully added comment: ${createdComment.id.toString()} for post: ${postId} by user: ${user.id} ${user.email}`);

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
    public async deleteComment(@Ctx("user") user: User, @Arg("commentId") commentId: number) {
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
