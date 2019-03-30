import { Inject, Service } from "typedi";
import { getRepository, Like, Repository } from "typeorm";
import { Post, PostInput, PostPreview } from "./model";
import { CommentInput } from "../comment/model";
import { UserService } from "../user/service";
import { User } from "../user/model";
import { CategoryService } from "../category/service";
import CommentService from "../comment/service";
import RateActionService from "../rate/service";

@Service()
export default class PostService {
    @Inject()
    private commentService: CommentService;

    @Inject()
    private userService: UserService;

    @Inject()
    private categoryService: CategoryService;

    @Inject()
    private rateActionService: RateActionService;

    private repository: Repository<Post> = getRepository(Post);

    public getPost(postId: number): Promise<Post> {
        return this.repository.findOne(postId, {
            relations: [
                'author',
                'comments',
                'comments.author',
                'ratedUsers',
                'ratedUsers.user',
                'comments.ratedUsers',
                'comments.ratedUsers.user',
            ],
        });
    }

    public async getAllPosts(): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            order: { creationDate: 'DESC' },
            relations: ['author', 'comments', 'ratedUsers', 'ratedUsers.user'],
        });

        //TODO Use aggregation query instead
        return this.getPostsPreview(posts);
    }

    public async getUserPosts(authorId: number): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            relations: ['author', 'comments', 'ratedUsers', 'ratedUsers.user'],
            order: { creationDate: 'DESC' },
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
        const currentPost = await this.getPost(post.id);

        return this.repository.save({
            ...currentPost,
            title: post.title,
            content: post.content,
            categories: post.categories,
        });
    }

    public deletePost(postId: number): Promise<any> {
        return this.repository.delete(postId);
    }

    public async addComment(postId: number, user: User, comment: CommentInput): Promise<Post> {
        await this.commentService.createComment(postId, user, comment);

        return this.getPost(postId);
    }

    public async searchPosts(searchQuery: string): Promise<PostPreview[]> {
        const posts = await this.repository.find({
            where: { title: Like(`%${searchQuery}%`) },
            relations: ['author', 'comments'],
        });

        return this.getPostsPreview(posts);
    }

    public async ratePost(user: User, postId: number, rateAction: boolean) {
        const post = await this.getPost(postId);
        const existingRateAction = (post.ratedUsers || []).find(rateUser => rateUser.user.id === user.id);

        if (existingRateAction) {
            await this.rateActionService.switchPostAction(existingRateAction);

            if (rateAction) {
                await this.repository.update(post.id, { rate: post.rate + 2 });
            } else {
                await this.repository.update(post.id, { rate: post.rate - 2 });
            }
        } else {
            const postRateAction = await this.rateActionService.createPostRateAction(user, post, rateAction);

            if (rateAction) {
                post.rate++;
                post.ratedUsers.push(postRateAction);

                await this.repository.save(post);
            } else {
                post.rate--;
                post.ratedUsers.push(postRateAction);

                await this.repository.save(post);
            }
        }

        return this.getPost(postId);
    }

    private getPostsPreview(posts: Post[]):PostPreview[] {
        return posts.map(({ id, content, comments, author, categories, creationDate, rate, title, ratedUsers }) => {
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
                ratedUsers,
                title,
            };
        });
    }
}
