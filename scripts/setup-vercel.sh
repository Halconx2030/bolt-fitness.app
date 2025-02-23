#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Configurando proyecto en Vercel..."

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Login en Vercel
echo "Iniciando sesión en Vercel..."
vercel login

# Asegurarse que next está instalado
echo "Verificando dependencias..."
npm install next@latest

# Configurar variables de entorno en Vercel
echo "Configurando variables de entorno en Vercel..."

vercel env add NEXT_PUBLIC_APP_URL production
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Vincular proyecto con Vercel
echo "Vinculando proyecto con Vercel..."
vercel link

# Build local para verificar
echo "Verificando build..."
npm run build

# Desplegar a producción
echo "¿Deseas desplegar a producción ahora? (s/n)"
read respuesta

if [ "$respuesta" = "s" ]; then
    vercel --prod
fi

echo "${GREEN}✅ Configuración de Vercel completada!${NC}" 