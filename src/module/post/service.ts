import { Inject, Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { Post, PostInput } from "./model";
import { CommentInput } from "../comment/model";
import { UserService } from "../user/service";
import { User } from "../user/model";
import CommentService from "../comment/service";

@Service()
export default class PostService {
    @Inject()
    private commentService: CommentService;

    @Inject()
    private userService: UserService;

    private repository: Repository<Post> = getRepository(Post);

    public getPost(postId: number): Promise<Post> {
        return this.repository.findOne(postId, {
            relations: ['author'],
        });
    }

    public getAllPosts(): Promise<Post[]> {
        return this.repository.find({
            relations: ['author'],
        });
    }

    public async createPost(post: PostInput, user: User): Promise<Post> {
        const createdPost = this.repository.create(post);

        return this.repository.save({
            ...createdPost,
            author: user,
            creationDate: new Date(),
        });
    }

    public async updatePost(post: PostInput): Promise<any> {
        return this.repository.update(post.id, post);
    }

    public deletePost(postId: number): Promise<any> {
        return this.repository.delete(postId);
    }

    public async addComment(postId: number, comment: CommentInput) {
        const post = await this.getPost(postId);

        return this.commentService.createComment(comment, post);
    }
}
