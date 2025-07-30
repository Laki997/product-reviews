import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/productService";
import { AppError } from "../utils/errors";

export class ProductController {
  constructor(private productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Product ID is required", 400);
      }
      const product = await this.productService.getProductById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price } = req.body;

      if (!name || !description || price === undefined) {
        throw new AppError("Name, description, and price are required", 400);
      }

      const product = await this.productService.createProduct({
        name,
        description,
        price,
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;

      if (!id) {
        throw new AppError("Product ID is required", 400);
      }

      const product = await this.productService.updateProduct(id, {
        name,
        description,
        price,
      });
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Product ID is required", 400);
      }
      await this.productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
