import { rateLimit } from 'express-rate-limit';
import { createClient } from 'redis';
import { NextResponse } from 'next/server';

// Redis client para caché
const redis = createClient({
  url: process.env.REDIS_URL,
});

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
});

// Middleware de caché
export async function cacheMiddleware(request: Request) {
  const key = request.url;
  const cached = await redis.get(key);

  if (cached) {
    return new NextResponse(cached, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null;
}
