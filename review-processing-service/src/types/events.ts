export interface ReviewEvent {
  type: "REVIEW_CREATED" | "REVIEW_UPDATED" | "REVIEW_DELETED";
  productId: string;
  reviewId: string;
  rating?: number;
  timestamp: Date;
}
