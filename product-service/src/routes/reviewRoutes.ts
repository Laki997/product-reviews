import { Router } from "express";
import { ReviewController } from "../controller/reviewController";
import { ReviewService } from "../service/reviewService";
import { ReviewRepository } from "../repository/reviewRepository";
import { prisma } from "../prisma";

const router = Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

router.get("/product/:productId", reviewController.getProductReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
