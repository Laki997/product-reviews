import { Router } from "express";
import { ProductController } from "../controller/productController";
import { ProductService } from "../service/productService";
import { ProductRepository } from "../repository/productRepository";
import { prisma } from "../prisma";
import { CacheService } from "../service/cacheService";

const router = Router();

const cacheService = new CacheService();

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository, cacheService);
const productController = new ProductController(productService);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
