import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { Post, PostInput, PostPreview } from "./model";
import { User } from "../user/model";
import PostService from "./service";
import Logger from "../../connector/logger";
import {CommentInput} from "../comment/model";
import OperationResult from "../operation/operation-result";

@Resolver(Post)
export default class PostResolver {
    @Inject()
    private postService: PostService;

    @Inject()
    private logger: Logger;

    @Query((returns) => [PostPreview], { nullable: true })
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

    @Mutation((returns) => Post)
    public async addComment(@Ctx("user") user: User, @Arg("postId") postId: number, @Arg("comment") comment: CommentInput) {
        try {
            return this.postService.addComment(postId, user, comment);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => Post)
    public async updateComment(@Ctx("user") user: User, @Arg("comment") comment: CommentInput) {
        try {
            return this.postService.updateComment(comment);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Mutation((returns) => Post)
    public async deleteComment(@Ctx("user") user: User, @Arg("commentId") commentId: number) {
        try {
            return this.postService.deleteComment(commentId);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => [PostPreview])
    public async getUserPosts(@Arg("userId") userId: number,) {
        try {
            return this.postService.getUserPosts(userId);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }

    @Query((returns) => [PostPreview])
    public async searchPosts(@Arg("query") query: string,) {
        try {
            return this.postService.searchPosts(query);
        } catch (error) {
            this.logger.error(error);

            throw error;
        }
    }
}
