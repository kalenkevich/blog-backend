import { Service } from "typedi";
import { DeleteResult, getRepository, Repository, UpdateResult} from "typeorm";
import { Comment, CommentInput } from "./model";
import { Post } from "../post/model";

@Service()
export default class CommentService {
    private repository: Repository<Comment> = getRepository(Comment);

    public createComment(comment: CommentInput, post: Post): Promise<Comment> {
        const createdComment = this.repository.create(comment);

        return this.repository.save({
            ...createdComment,
            post,
        });
    }

    public updateComment(comment: CommentInput): Promise<UpdateResult> {
        return this.repository.update(comment.id, comment);
    }

    public deleteComment(commentId: number): Promise<DeleteResult> {
        return this.repository.delete(commentId);
    }
}
