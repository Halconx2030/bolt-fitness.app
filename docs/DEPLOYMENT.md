# Guía de Deployment

## Entornos de Despliegue

### Desarrollo

- URL: `http://localhost:3000`
- Supabase: Instancia local
- Variables de entorno: `.env.development`

### Staging

- URL: `https://staging.boltfitness.app`
- Supabase: Proyecto de staging
- Variables de entorno: `.env.staging`

### Producción

- URL: `https://boltfitness.app`
- Supabase: Proyecto de producción
- Variables de entorno: `.env.production`

## Requisitos Previos

1. Node.js v18 o superior
2. Cuenta en Vercel
3. Proyecto en Supabase
4. Repositorio en GitHub

## Configuración de CI/CD

### GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run test:e2e

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/actions/cli@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Proceso de Deployment

1. **Preparación**

   ```bash
   # Instalar dependencias
   npm ci

   # Verificar tipos
   npm run type-check

   # Ejecutar tests
   npm run test

   # Construir aplicación
   npm run build
   ```

2. **Deployment Manual**

   ```bash
   # Deploy a Vercel
   vercel deploy --prod
   ```

3. **Deployment Automático**
   - Los pushes a `main` disparan el deployment automático
   - Las pull requests crean previews automáticas

## Variables de Entorno

Crear los siguientes archivos:

1. `.env.local`

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. `.env.production`
   ```
   NEXT_PUBLIC_SUPABASE_URL=prod_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
   ```

## Monitoreo y Logs

1. **Vercel**

   - Dashboard: https://vercel.com/dashboard
   - Logs: https://vercel.com/dashboard/logs
   - Analytics: https://vercel.com/analytics

2. **Supabase**
   - Dashboard: https://app.supabase.io
   - Logs: Database > Logs
   - Monitoreo: Database > Monitoring

## Rollback

En caso de necesitar revertir un deployment:

1. **Vercel**

   ```bash
   # Listar deployments
   vercel ls

   # Revertir al deployment anterior
   vercel rollback
   ```

2. **Manual**
   - Hacer revert del último commit
   - Push al branch principal
   ```bash
   git revert HEAD
   git push origin main
   ```

## Optimización de Performance

1. **Análisis de Bundle**

   ```bash
   # Analizar tamaño del bundle
   ANALYZE=true npm run build
   ```

2. **Monitoreo de Performance**
   - Vercel Analytics
   - Lighthouse CI
   - Web Vitals

## Seguridad

1. **Headers de Seguridad**

   - CSP configurado en `next.config.js`
   - HSTS habilitado
   - X-Frame-Options configurado

2. **Supabase**
   - RLS habilitado
   - Políticas de seguridad configuradas
   - Backups automáticos activados

## Troubleshooting

### Problemas Comunes

1. **Error 500 en Producción**

   - Verificar logs en Vercel
   - Comprobar conexión con Supabase
   - Validar variables de entorno

2. **Performance Degradada**

   - Analizar métricas en Vercel Analytics
   - Revisar queries de Supabase
   - Verificar caché de CDN

3. **Fallos en CI/CD**
   - Revisar logs de GitHub Actions
   - Validar configuración de secretos
   - Comprobar permisos de deployment
