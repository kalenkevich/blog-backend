import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Comment, CommentInput } from "./model";
import { Post } from "../post/model";

@Service()
export default class CommentService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public createComment(comment: CommentInput, post: Post): Promise<Comment> {
        const createdComment = this.entityManager.create(Comment, comment);

        return this.entityManager.save(Comment, {
            ...createdComment,
            post,
        });
    }

    public updateComment(comment: CommentInput): Promise<any> {
        return this.entityManager.update(Comment, comment.id, comment);
    }

    public deleteComment(commentId: string): Promise<any> {
        return this.entityManager.delete(Comment, commentId);
    }
}
