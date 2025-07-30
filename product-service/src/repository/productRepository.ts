import { PrismaClient, Product } from "@prisma/client";
import { NotFoundError } from "../utils/errors";

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return product;
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
  }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{ name: string; description: string; price: number }>
  ): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
  }

  async getAverageRating(productId: string): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    return result._avg.rating;
  }
}
