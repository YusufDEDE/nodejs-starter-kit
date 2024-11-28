// src/config/redis.ts
import Redis from 'ioredis';

let redisClient: Redis | null = null;

const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD || undefined, // Optional, only if authentication is required
        });

        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    return redisClient;
};

export default getRedisClient;