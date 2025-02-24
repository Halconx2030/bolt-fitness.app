# Deployment

## Visión General

BoltFitness.app utiliza un flujo de deployment moderno y automatizado, aprovechando las capacidades de Vercel para el frontend y Supabase para el backend.

## Entornos

### Desarrollo

- URL: `https://dev.boltfitness.app`
- Rama: `develop`
- Actualización: Automática en cada push

### Staging

- URL: `https://staging.boltfitness.app`
- Rama: `staging`
- Actualización: Manual desde develop

### Producción

- URL: `https://boltfitness.app`
- Rama: `main`
- Actualización: Manual desde staging

## Configuración de Vercel

### Setup Inicial

1. **Conexión con GitHub**

   ```bash
   # Instalar Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Vincular proyecto
   vercel link
   ```

2. **Variables de Entorno**

   ```bash
   # Archivo .env.production
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://api.boltfitness.app
   NEXT_PUBLIC_SITE_URL=https://boltfitness.app
   ```

3. **Configuración de Proyecto**
   ```json
   // vercel.json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "regions": ["cdg1"],
     "env": {
       "NODE_ENV": "production"
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, staging, main]
  pull_request:
    branches: [develop, staging, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: vercel/actions/cli@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Supabase

### Migraciones

```bash
# Generar migración
supabase db diff -f nombre_migracion

# Aplicar migraciones
supabase db push
```

### Configuración de Producción

1. **RLS Policies**

   ```sql
   -- Verificar políticas
   SELECT * FROM pg_policies;

   -- Habilitar RLS
   ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
   ```

2. **Backups**

   ```bash
   # Backup manual
   supabase db dump -f backup.sql

   # Restaurar
   supabase db restore backup.sql
   ```

## Monitoreo

### Vercel Analytics

```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Sentry

```typescript
// sentry.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Logging

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
});
```

## SSL/TLS

### Certificados

- Gestión automática por Vercel
- Renovación automática
- Forzar HTTPS

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

## Optimización

### Performance

1. **Imágenes**

   ```typescript
   // next.config.js
   module.exports = {
     images: {
       domains: ['storage.boltfitness.app'],
       formats: ['image/avif', 'image/webp'],
     },
   };
   ```

2. **Caching**
   ```typescript
   // pages/api/exercises.ts
   export default function handler(req, res) {
     res.setHeader('Cache-Control', 's-maxage=3600');
     // ...
   }
   ```

### SEO

```typescript
// components/SEO.tsx
import Head from 'next/head';

export function SEO({ title, description }) {
  return (
    <Head>
      <title>{title} | BoltFitness</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
```

## Scripts de Deployment

```json
// package.json
{
  "scripts": {
    "deploy:staging": "vercel --prod",
    "deploy:prod": "vercel --prod",
    "db:migrate": "supabase db push",
    "db:backup": "supabase db dump",
    "analyze": "ANALYZE=true next build",
    "lighthouse": "lighthouse-ci"
  }
}
```

## Rollback

### Vercel

```bash
# Listar deployments
vercel ls

# Rollback a versión anterior
vercel rollback [deployment-id]
```

### Supabase

```sql
-- Revertir última migración
BEGIN;
  SELECT _supabase_rollback();
COMMIT;
```

## Checklist de Deployment

1. **Pre-deployment**

   - [ ] Tests pasando
   - [ ] Build exitoso
   - [ ] Variables de entorno configuradas
   - [ ] Migraciones preparadas

2. **Deployment**

   - [ ] Backup de base de datos
   - [ ] Deploy a staging
   - [ ] Pruebas en staging
   - [ ] Deploy a producción

3. **Post-deployment**
   - [ ] Verificar logs
   - [ ] Monitorear métricas
   - [ ] Verificar SSL
   - [ ] Pruebas de humo

## Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Platform](https://supabase.io/docs/guides/platform)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
