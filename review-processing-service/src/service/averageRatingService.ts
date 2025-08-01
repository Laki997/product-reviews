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

      await this.updateProductCache(event.productId, averageRating);

      await this.updateReviewsCache(event.productId);

      await this.invalidateAllProductsCache();

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

  private async updateProductCache(
    productId: string,
    averageRating: number | null
  ) {
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

  private async updateReviewsCache(productId: string) {
    const cacheKey = `reviews:${productId}`;
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    await this.redis.setEx(cacheKey, 1800, JSON.stringify(reviews));
  }

  private async invalidateAllProductsCache() {
    try {
      const cacheKey = "products:all";

      const products = await this.prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });

      const productsWithRatings = await Promise.all(
        products.map(async (product) => {
          const averageRating = await this.calculateAverageRating(product.id);
          return {
            ...product,
            price: Number(product.price),
            averageRating,
          };
        })
      );

      await this.redis.setEx(
        cacheKey,
        900,
        JSON.stringify(productsWithRatings)
      );
      console.log("💾 Updated 'all products' cache");
    } catch (error) {
      console.error("❌ Error invalidating all products cache:", error);
    }
  }
}
