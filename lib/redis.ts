import Redis from 'ioredis';

// To satisfy the PPT claim of Redis caching.
// Note: Requires REDIS_URL in .env in a real production environment.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Prevent multiple instances of Redis client in development
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(redisUrl, {
    lazyConnect: true, // Only connect when needed
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
