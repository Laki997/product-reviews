import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../service/reviewService";
import { AppError } from "../utils/errors";

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  getProductReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        throw new AppError("Product ID is required", 400);
      }
      const reviews = await this.reviewService.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Review ID is required", 400);
      }

      const review = await this.reviewService.getReviewById(id);
      res.json(review);
    } catch (error) {
      next(error);
    }
  };

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, firstName, lastName, reviewText, rating } = req.body;

      if (
        !productId ||
        !firstName ||
        !lastName ||
        !reviewText ||
        rating === undefined
      ) {
        throw new AppError("All fields are required", 400);
      }

      const review = await this.reviewService.createReview({
        productId,
        firstName,
        lastName,
        reviewText,
        rating,
      });
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, reviewText, rating } = req.body;

      if (!id) {
        throw new AppError("Review ID is required", 400);
      }

      const review = await this.reviewService.updateReview(id, {
        firstName,
        lastName,
        reviewText,
        rating,
      });
      res.json(review);
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Review ID is required", 400);
      }
      await this.reviewService.deleteReview(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
