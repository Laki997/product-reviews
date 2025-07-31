import amqp, { Connection, Channel, Message } from "amqplib";
import { ReviewEvent } from "../types/events";
import { AverageRatingService } from "../service/averageRatingService";

export class EventConsumer {
  private connection: any;
  private channel: any;
  private readonly queueName = "review_events";

  constructor(private averageRatingService: AverageRatingService) {}

  async start() {
    try {
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
      );

      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queueName, {
        durable: true,

        arguments: { "x-prefetch-count": 1 },
      });

      await this.channel.prefetch(1);

      console.log("✅ Connected to RabbitMQ");

      await this.consumeMessages();
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ:", error);
      process.exit(1);
    }
  }

  private async consumeMessages() {
    if (!this.channel) return;

    await this.channel.consume(this.queueName, async (msg: Message | null) => {
      if (!msg) return;

      try {
        const event: ReviewEvent = JSON.parse(msg.content.toString());
        console.log(
          `📥 Processing event: ${event.type} for product ${event.productId}`
        );

        await this.averageRatingService.processReviewEvent(event);

        this.channel?.ack(msg);
        console.log(
          `✅ Processed event: ${event.type} for product ${event.productId}`
        );
      } catch (error) {
        console.error("❌ Error processing event:", error);

        this.channel?.nack(msg, false, true);
      }
    });
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
