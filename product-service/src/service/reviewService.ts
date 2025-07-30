import { ReviewRepository } from "../repository/reviewRepository";

export class ReviewService {
  constructor(private reviewRepository: ReviewRepository) {}

  async getProductReviews(productId: string) {
    return this.reviewRepository.findByProductId(productId);
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
    return this.reviewRepository.create(data);
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
    return this.reviewRepository.update(id, data);
  }

  async deleteReview(id: string): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
