import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { AppError } from "./utils/errors";
import { prisma } from "./prisma";
import { EventPublisher } from "./events.ts/publisher";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const eventPublisher = EventPublisher.getInstance();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Product Service",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      statusCode: 500,
    });
  }
);

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    statusCode: 404,
  });
});

async function startServer() {
  try {
    await eventPublisher.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
      console.log(
        `📊 Health check available at http://localhost:${PORT}/health`
      );
      console.log(
        `🛍️  Products API available at http://localhost:${PORT}/api/products`
      );
      console.log(
        `⭐ Reviews API available at http://localhost:${PORT}/api/reviews`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// app.listen(PORT, () => {
//   console.log(`🚀 Product Service running on port ${PORT}`);
// });

export default app;
