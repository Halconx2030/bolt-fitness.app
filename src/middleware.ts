import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Crear instancia de Redis para rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Configurar rate limiting
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { pathname } = request.nextUrl;

  // Aplicar rate limiting solo a rutas de API
  if (pathname.startsWith('/api')) {
    const result = await ratelimit.limit(ip);

    if (!result.success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
        },
      });
    }
  }

  // Verificar autenticación para rutas protegidas
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected')) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const response = NextResponse.next();

  // Añadir headers de seguridad adicionales
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/profile/:path*', '/exercises/:path*'],
};
