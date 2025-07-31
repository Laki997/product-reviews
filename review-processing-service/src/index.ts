import dotenv from "dotenv";
import { EventConsumer } from "./events/consumer";
import { AverageRatingService } from "./service/averageRatingService";

dotenv.config();

const PORT = process.env.PORT || 3001;

async function main() {
  console.log("🚀 Starting Review Processing Service...");

  const averageRatingService = new AverageRatingService();
  const eventConsumer = new EventConsumer(averageRatingService);

  await eventConsumer.start();

  console.log(`📊 Review Processing Service running on port ${PORT}`);
  console.log("🔄 Listening for review events...");
}

main().catch(console.error);
