import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Decimal;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  firstName: string;
  lastName: string;
  reviewText: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
}

export interface CreateReviewRequest {
  productId: string;
  firstName: string;
  lastName: string;
  reviewText: string;
  rating: number;
}

export interface UpdateReviewRequest {
  firstName?: string;
  lastName?: string;
  reviewText?: string;
  rating?: number;
}

export interface ProductWithAverageRating {
  id: string;
  name: string;
  description: string;
  price: number;
  averageRating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewEvent {
  type: "REVIEW_CREATED" | "REVIEW_UPDATED" | "REVIEW_DELETED";
  productId: string;
  reviewId: string;
  rating?: number | undefined;
  timestamp: Date;
}
