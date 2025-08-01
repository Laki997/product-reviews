import { EventPublisher } from "../events.ts/publisher";
import { ReviewRepository } from "../repository/reviewRepository";
import { ReviewEvent } from "../types";
import { CacheService } from "./cacheService";

export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private eventPublisher: EventPublisher,
    private cacheService: CacheService
  ) {}

  async getProductReviews(productId: string) {
    const cacheKey = `reviews:${productId}`;

    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      console.log(`📦 Returning cached reviews for product ${productId}`);
      return cached;
    }

    const reviews = await this.reviewRepository.findByProductId(productId);

    await this.cacheService.set(cacheKey, reviews, 1800);
    console.log(`�� Cached reviews for product ${productId}`);

    return reviews;
  }

  async getReviewById(id: string) {
    return this.reviewRepository.findById(id);
  }

  async createReview(data: {
    productId: string;
    firstName: string;
    lastName: string;
    reviewText: string;
    rating: number;
  }) {
    const review = await this.reviewRepository.create(data);

    const event: ReviewEvent = {
      type: "REVIEW_CREATED",
      productId: data.productId,
      reviewId: review.id,
      rating: data.rating,
      timestamp: new Date(),
    };
    await this.eventPublisher.publishReviewEvent(event);
    return review;
  }

  async updateReview(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      reviewText: string;
      rating: number;
    }>
  ) {
    const review = await this.reviewRepository.update(id, data);

    const event: ReviewEvent = {
      type: "REVIEW_UPDATED",
      productId: review.productId,
      reviewId: review.id,
      rating: data.rating || undefined,
      timestamp: new Date(),
    };

    await this.eventPublisher.publishReviewEvent(event);
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    const review = await this.reviewRepository.findById(id);

    await this.reviewRepository.delete(id);

    const event: ReviewEvent = {
      type: "REVIEW_DELETED",
      productId: review.productId,
      reviewId: review.id,
      timestamp: new Date(),
    };

    await this.eventPublisher.publishReviewEvent(event);
  }
}
