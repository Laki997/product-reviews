import { PrismaClient, Review } from "@prisma/client";
import { NotFoundError, ValidationError } from "../utils/errors";

export class ReviewRepository {
  constructor(private prisma: PrismaClient) {}

  async findByProductId(productId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError(`Review with id ${id} not found`);
    }

    return review;
  }

  async create(data: {
    productId: string;
    firstName: string;
    lastName: string;
    reviewText: string;
    rating: number;
  }): Promise<Review> {
    if (data.rating < 1 || data.rating > 5) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${data.productId} not found`);
    }

    return this.prisma.review.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      reviewText: string;
      rating: number;
    }>
  ): Promise<Review> {
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    try {
      return await this.prisma.review.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundError(`Review with id ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundError(`Review with id ${id} not found`);
    }
  }
}
