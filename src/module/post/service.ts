import {Inject, Service} from "typedi";
import {getRepository, Like, Repository} from "typeorm";
import {Post, PostInput, PostPreview} from "./model";
import {CommentInput} from "../comment/model";
import {User} from "../user/model";
import {CategoryService} from "../category/service";
import CommentService from "../comment/service";
import RateActionService from "../rate/service";
import UserService from "../user/service";

@Service()
export default class PostService {
  @Inject()
  private commentService: CommentService;

  @Inject()
  private categoryService: CategoryService;

  @Inject()
  private rateActionService: RateActionService;

  @Inject()
  private userService: UserService;

  private repository: Repository<Post> = getRepository(Post);

  public async getPost(postId: number): Promise<Post> {
    const post = await this.repository.findOne(postId, {
      relations: [
        'categories',
        'comments',
        'ratedUsers',
        'comments.ratedUsers',
      ],
    });
    const author = await this.userService.getUser(post.authorId);
    const commentsAuthorIds = post.comments.map(({ authorId }) => authorId);
    const commentsAuthor = await this.userService.search(commentsAuthorIds);

    return {
      ...post,
      comments: (post.comments || []).map((comment) => {
        const author = (commentsAuthor || []).find(({ id }: any) => id === comment.authorId);

        return {
          ...comment,
          author,
        };
      }),
      author,
    };
  }

  public async getAllPosts(): Promise<PostPreview[]> {
    const posts = await this.repository.find({
      order: {creationDate: 'DESC'},
      relations: ['categories', 'comments', 'ratedUsers'],
    });
    const userIds = (posts || []).map(({ authorId }) => authorId);
    const users = await this.userService.search(userIds);

    //TODO Use aggregation query instead
    return this.getPostsPreview(posts, users);
  }

  public async getUserPosts(authorId: number): Promise<PostPreview[]> {
    const posts = await this.repository.find({
      relations: ['categories', 'comments', 'ratedUsers'],
      order: {creationDate: 'DESC'},
      where: {
        authorId,
      },
    });
    const user = await this.userService.getUser(authorId);

    //TODO Use aggregation query instead
    return this.getPostsPreview(posts, [user]);
  }

  public async createPost(post: PostInput, author: User): Promise<Post> {
    const createdPost = this.repository.create({
      ...post,
      authorId: author.id,
      creationDate: new Date(),
    });

    const savedPost = await this.repository.save(createdPost);

    return {
      ...savedPost,
      author,
    }
  }

  public async updatePost(post: PostInput): Promise<any> {
    const currentPost = await this.repository.findOne(post.id, {relations: ['categories']});
    const currentPostCategories = (currentPost.categories || []).map(({id}) => ({id}));
    const newPostCategories = (post.categories || []).map(({id}) => ({id}));

    await this.repository.createQueryBuilder()
      .relation(Post, "categories")
      .of({id: post.id})
      .remove(currentPostCategories);

    await this.repository.createQueryBuilder()
      .relation(Post, "categories")
      .of({id: post.id})
      .add(newPostCategories);

    await this.repository.update(post.id, {
      title: post.title,
      content: post.content,
    });

    return this.getPost(post.id);
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
      where: {title: Like(`%${searchQuery}%`)},
      relations: ['comments', 'ratedUsers'],
    });
    const userIds = (posts || []).map(({ authorId }) => authorId);
    const users = await this.userService.search(userIds);

    return this.getPostsPreview(posts, users);
  }

  public async ratePost(user: User, postId: number, rateAction: boolean) {
    const post = await this.getPost(postId);
    const existingRateAction = (post.ratedUsers || []).find(rateUser => rateUser.userId === user.id);

    if (existingRateAction) {
      await this.rateActionService.switchPostAction(existingRateAction);

      if (rateAction) {
        await this.repository.update(post.id, {rate: post.rate + 2});
      } else {
        await this.repository.update(post.id, {rate: post.rate - 2});
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

  private getPostsPreview(posts: Post[], users: User[]): PostPreview[] {
    return posts.map(({id, content, comments, authorId, categories, creationDate, rate, title, ratedUsers}) => {
      const commentsCount = (comments || []).length;
      const contentPreview = content.slice(0, 500);
      const author = (users || []).find(({ id }) => id === authorId);

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
