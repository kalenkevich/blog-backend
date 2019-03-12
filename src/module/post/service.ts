import { Inject, Service } from "typedi";
import { getRepository, Like, Repository } from "typeorm";
import { Post, PostInput, PostPreview } from "./model";
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
            relations: ['author', 'comments', 'comments.author'],
        });
    }

    public async getAllPosts(): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            relations: ['author', 'comments'],
        });

        //TODO Use aggregation query instead
        return this.getPostsPreview(posts);
    }

    public async getUserPosts(authorId: number): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            relations: ['author', 'comments'],
            where: {
                author: { id: authorId },
            },
        });

        //TODO Use aggregation query instead
        return this.getPostsPreview(posts);
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

    public async addComment(postId: number, user: User, comment: CommentInput): Promise<Post> {
        const createdComment = await this.commentService.createComment(postId, user, comment);

        return this.getPostByComment(createdComment.id);
    }

    public async updateComment(comment: CommentInput): Promise<Post> {
        await this.commentService.updateComment(comment);

        return this.getPostByComment(comment.id);
    }

    public async deleteComment(commentId: number): Promise<Post> {
        const post = await this.getPostByComment(commentId);

        await this.commentService.deleteComment(commentId);

        return this.getPost(post.id);
    }

    public async searchPosts(searchQuery: string): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            where: { title: Like(`%${searchQuery}%`) },
            relations: ['author', 'comments'],
        });

        return this.getPostsPreview(posts);
    }

    private getPostByComment(commentId: number): Promise<Post> {
        return this.repository.findOne({
            where: {
                comments: { id: commentId },
            },
            relations: ['author', 'comments', 'comments.author'],
        });
    }

    private getPostsPreview(posts: Post[]):PostPreview[] {
        return posts.map(({ id, content, comments, author, categories, creationDate, rate, title }) => {
            const commentsCount = (comments || []).length;
            const contentPreview = `${content.slice(0, 500)}...`;

            return {
                id,
                contentPreview,
                commentsCount,
                author,
                categories,
                creationDate,
                rate,
                title,
            };
        });
    }
}
