import { Service} from "typedi";
import { DeleteResult, getRepository, Repository, UpdateResult} from "typeorm";
import { Comment, CommentInput } from "./model";
import { User } from "../user/model";

@Service()
export default class CommentService {
    private repository: Repository<Comment> = getRepository(Comment);

    public getCommentPost(commentId: number) {
        return this.repository.findOne(commentId);
    }

    public createComment(postId: number, author: User, comment: CommentInput): Promise<Comment> {
        const createdComment = this.repository.create({
            ...comment,
            creationDate: new Date(),
            postId,
            author,
        });

        return this.repository.save(createdComment);
    }

    public updateComment(comment: CommentInput): Promise<UpdateResult> {
        return this.repository.update(comment.id, comment);
    }

    public deleteComment(commentId: number): Promise<DeleteResult> {
        return this.repository.delete(commentId);
    }
}
