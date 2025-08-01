import { createClient } from "redis";

export class CacheService {
  private redis: ReturnType<typeof createClient>;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://redis:6379",
    });
    this.redis.connect().catch(console.error);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await this.redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }
}
