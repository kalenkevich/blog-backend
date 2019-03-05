import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Post, PostInput } from "./model";
import { CommentInput } from "../comment/model";
import { UserService } from "../user/service";
import CommentService from "../comment/service";

@Service()
export default class PostService {
    @Inject("EntityManager")
    private entityManager: EntityManager;

    @Inject()
    private commentService: CommentService;

    @Inject()
    private userService: UserService;

    public getPost(postId: string): Promise<Post> {
        return this.entityManager.findOne(Post, postId, {
            relations: ['user'],
        });
    }

    public getAllPosts(): Promise<Post[]> {
        return this.entityManager.find(Post);
    }

    public async createPost(post: PostInput, userId: string): Promise<Post> {
        const createdPost = this.entityManager.create(Post, post);
        const user = await this.userService.getUser(userId);

        return this.entityManager.save(Post, {
            ...createdPost,
            user,
            creationDate: new Date(),
        });
    }

    public async updatePost(post: PostInput): Promise<any> {
        return this.entityManager.update(Post, post.id, post);
    }

    public deletePost(postId: string): Promise<any> {
        return this.entityManager.delete(Post, postId);
    }

    public async addComment(postId: string, comment: CommentInput) {
        const post = await this.getPost(postId);

        return this.commentService.createComment(comment, post);
    }
}
