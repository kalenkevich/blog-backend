import { Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { Post } from "../post/model";
import { User } from "../user/model";
import { Comment } from "../comment/model";
import { PostRateUserAction, CommentRateUserAction } from './model';

@Service()
export default class RateActionService {
    private postRateActionRepository: Repository<PostRateUserAction> = getRepository(PostRateUserAction);

    private commentRateActionRepository: Repository<CommentRateUserAction> = getRepository(CommentRateUserAction);

    createPostRateAction(user: User, post: Post, action: boolean): Promise<PostRateUserAction> {
        const rateAction = this.postRateActionRepository.create({
            user,
            post,
            action,
        });

        return this.postRateActionRepository.save(rateAction);
    }

    createCommentRateAction(user: User, comment: Comment, action: boolean): Promise<CommentRateUserAction> {
        const rateAction = this.commentRateActionRepository.create({
            user,
            comment,
            action,
        });

        return this.commentRateActionRepository.save(rateAction);
    }

    switchPostAction(rateAction: PostRateUserAction) {
        return this.postRateActionRepository.update(rateAction.id, { action: !rateAction.action });
    }

    switchCommentAction(rateAction: CommentRateUserAction) {
        return this.commentRateActionRepository.update(rateAction.id, { action: !rateAction.action });
    }
}
