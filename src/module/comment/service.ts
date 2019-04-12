import {Inject, Service} from "typedi";
import {DeleteResult, getRepository, Repository, UpdateResult} from "typeorm";
import {Comment, CommentInput} from "./model";
import {User} from "../user/model";
import RateActionService from "../rate/service";
import UserService from "../user/service";

@Service()
export default class CommentService {
  private repository: Repository<Comment> = getRepository(Comment);

  @Inject()
  private rateActionService: RateActionService;

  @Inject()
  private userService: UserService;

  public async getComment(commentId: number): Promise<Comment> {
    const comment = await this.repository.findOne(commentId, {
      relations: [
        'ratedUsers',
      ],
    });
    const author = await this.userService.getUser(comment.authorId);

    return {
      ...comment,
      author,
    };
  }

  public async createComment(postId: number, author: User, comment: CommentInput): Promise<Comment> {
    const createdComment = this.repository.create({
      ...comment,
      creationDate: new Date(),
      postId,
      authorId: author.id,
    });

    const savedComment = await this.repository.save(createdComment);

    return {
      ...savedComment,
      author,
    };
  }

  public updateComment(comment: CommentInput): Promise<UpdateResult> {
    return this.repository.update(comment.id, comment);
  }

  public deleteComment(commentId: number): Promise<DeleteResult> {
    return this.repository.delete(commentId);
  }

  public async rateComment(user: User, commentId: number, rateAction: boolean) {
    const comment = await this.getComment(commentId);
    const existingRateAction = (comment.ratedUsers || []).find(rateUser => rateUser.userId === user.id);

    if (existingRateAction) {
      await this.rateActionService.switchCommentAction(existingRateAction);

      if (rateAction) {
        await this.repository.update(comment.id, {rate: comment.rate + 2});
      } else {
        await this.repository.update(comment.id, {rate: comment.rate - 2});
      }
    } else {
      const commentRateAction = await this.rateActionService.createCommentRateAction(user, comment, rateAction);

      if (rateAction) {
        comment.rate++;
        comment.ratedUsers.push(commentRateAction);

        await this.repository.save(comment);
      } else {
        comment.rate--;
        comment.ratedUsers.push(commentRateAction);

        await this.repository.save(comment);
      }
    }

    return this.getComment(commentId);
  }
}
