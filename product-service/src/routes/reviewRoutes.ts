import { Router } from "express";
import { ReviewController } from "../controller/reviewController";
import { ReviewService } from "../service/reviewService";
import { ReviewRepository } from "../repository/reviewRepository";
import { prisma } from "../prisma";
import { EventPublisher } from "../events.ts/publisher";
import { CacheService } from "../service/cacheService";

const eventPublisher = EventPublisher.getInstance();

const router = Router();

const cacheService = new CacheService();
const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(
  reviewRepository,
  eventPublisher,
  cacheService
);
const reviewController = new ReviewController(reviewService);

router.get("/product/:productId", reviewController.getProductReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
