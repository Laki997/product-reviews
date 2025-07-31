import amqp from "amqplib";
import { ReviewEvent } from "../types/index";

export class EventPublisher {
  private static instance: EventPublisher;
  private connection: any;
  private channel: any;
  private readonly queueName = "review_events";

  private constructor() {}

  static getInstance(): EventPublisher {
    if (!EventPublisher.instance) {
      EventPublisher.instance = new EventPublisher();
    }
    return EventPublisher.instance;
  }

  async connect() {
    if (this.channel) {
      console.log("✅ Already connected to RabbitMQ");
      return;
    }

    try {
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
      );

      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      console.log("✅ Connected to RabbitMQ");
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ:", error);
    }
  }

  async publishReviewEvent(event: ReviewEvent) {
    if (!this.channel) {
      console.error("❌ RabbitMQ channel not available");
      return;
    }

    try {
      const message = JSON.stringify(event);
      this.channel.sendToQueue(this.queueName, Buffer.from(message), {
        persistent: true,
      });
      console.log(
        `📤 Published event: ${event.type} for product ${event.productId}`
      );
    } catch (error) {
      console.error("❌ Failed to publish event:", error);
    }
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
