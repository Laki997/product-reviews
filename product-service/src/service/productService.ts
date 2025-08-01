import { ProductRepository } from "../repository/productRepository";
import { ProductWithAverageRating } from "../types";
import { CacheService } from "./cacheService";

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private cacheService: CacheService
  ) {}

  async getAllProducts(): Promise<ProductWithAverageRating[]> {
    const cacheKey = "products:all";

    const cached = await this.cacheService.get<ProductWithAverageRating[]>(
      cacheKey
    );
    if (cached) {
      console.log("📦 Returning cached products");
      return cached;
    }
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

    await this.cacheService.set(cacheKey, productsWithRatings, 900);
    console.log("💾 Cached products");
    return productsWithRatings;
  }

  async getProductById(id: string): Promise<ProductWithAverageRating> {
    const cacheKey = `product:${id}`;

    const cached = await this.cacheService.get<ProductWithAverageRating>(
      cacheKey
    );
    if (cached) {
      console.log(`📦 Returning cached product ${id}`);
      return cached;
    }

    const product = await this.productRepository.findById(id);
    const averageRating = await this.productRepository.getAverageRating(id);

    const productWithRating = {
      ...product,
      price: Number(product.price),
      averageRating,
    };

    await this.cacheService.set(cacheKey, productWithRating, 3600);
    console.log(`💾 Cached product ${id}`);

    return productWithRating;
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
