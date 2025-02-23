#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Iniciando configuración completa del proyecto..."

# Función para ejecutar y verificar scripts
run_script() {
    if [ -f "$1" ]; then
        echo "Ejecutando $1..."
        bash "$1"
        if [ $? -eq 0 ]; then
            echo "${GREEN}✓ $1 completado${NC}"
        else
            echo "${RED}❌ Error en $1${NC}"
            exit 1
        fi
    else
        echo "${RED}❌ No se encontró $1${NC}"
        exit 1
    fi
}

# Ejecutar scripts en orden
run_script "scripts/init-supabase.sh"
run_script "scripts/verify-supabase.sh"
run_script "scripts/setup-vercel.sh"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Generar tipos de Prisma
echo "🔄 Generando tipos de Prisma..."
npx prisma generate

# Construir el proyecto
echo "🏗️ Construyendo el proyecto..."
npm run build

echo "${GREEN}✅ Configuración completada!${NC}"
echo "
Próximos pasos:
1. Revisa el archivo .env y verifica las variables
2. Ejecuta 'vercel' para desplegar a producción
3. Visita tu proyecto en Vercel para más configuraciones
" 