import { Inject, Service } from "typedi";
import { EntityManager } from "typeorm";
import { Review, ReviewInput } from "./model";

@Service("ReviewService")
export default class ReviewService {
    @Inject("EntityManager")
    public entityManager: EntityManager;

    public createReview(review: ReviewInput): Promise<Review> {
        const createdReview = this.entityManager.create(Review, review);

        return this.entityManager.save(Review, createdReview);
    }
}
