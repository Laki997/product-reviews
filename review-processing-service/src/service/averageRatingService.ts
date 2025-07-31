import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { ReviewEvent } from "../types/events";

export class AverageRatingService {
  private prisma: PrismaClient;
  private redis: ReturnType<typeof createClient>;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://redis:6379",
    });

    this.redis.connect().catch(console.error);
  }

  async processReviewEvent(event: ReviewEvent) {
    try {
      const averageRating = await this.calculateAverageRating(event.productId);

      await this.updateProductAverageRating(event.productId, averageRating);

      await this.updateCache(event.productId, averageRating);

      console.log(
        `📊 Updated average rating for product ${event.productId}: ${averageRating}`
      );
    } catch (error) {
      console.error("❌ Error processing review event:", error);
      throw error;
    }
  }

  private async calculateAverageRating(
    productId: string
  ): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    return result._avg.rating;
  }

  private async updateProductAverageRating(
    productId: string,
    averageRating: number | null
  ) {
    await this.prisma.product.update({
      where: { id: productId },
      data: { averageRating },
    });
  }

  private async updateCache(productId: string, averageRating: number | null) {
    const cacheKey = `product:${productId}`;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (product) {
      const productWithRating = {
        ...product,
        averageRating,
      };

      await this.redis.setEx(cacheKey, 3600, JSON.stringify(productWithRating));
    }
  }
}
