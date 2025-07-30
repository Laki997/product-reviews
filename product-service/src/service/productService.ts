import { ProductRepository } from "../repository/productRepository";
import { ProductWithAverageRating } from "../types";

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(): Promise<ProductWithAverageRating[]> {
    const products = await this.productRepository.findAll();

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const averageRating = await this.productRepository.getAverageRating(
          product.id
        );
        return {
          ...product,
          price: Number(product.price),
          averageRating,
        };
      })
    );

    return productsWithRatings;
  }

  async getProductById(id: string): Promise<ProductWithAverageRating> {
    const product = await this.productRepository.findById(id);
    const averageRating = await this.productRepository.getAverageRating(id);

    return {
      ...product,
      price: Number(product.price),
      averageRating,
    };
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
  }) {
    if (data.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: Partial<{ name: string; description: string; price: number }>
  ) {
    if (data.price !== undefined && data.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
