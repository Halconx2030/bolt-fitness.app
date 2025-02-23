#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verificando configuración de Supabase..."

# Verificar variables de entorno
check_env() {
    if [ -z "${!1}" ]; then
        echo "${RED}❌ Falta variable de entorno: $1${NC}"
        return 1
    else
        echo "${GREEN}✓ Variable $1 configurada${NC}"
        return 0
    }
}

# Verificar conexión a Supabase
check_supabase_connection() {
    if supabase status &> /dev/null; then
        echo "${GREEN}✓ Conexión a Supabase establecida${NC}"
        return 0
    else
        echo "${RED}❌ No se pudo conectar a Supabase${NC}"
        return 1
    }
}

# Verificar variables requeridas
ENV_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "NEXT_PUBLIC_SUPABASE_PROJECT_ID"
    "SUPABASE_SERVICE_ROLE_KEY"
    "SUPABASE_JWT_SECRET"
    "SUPABASE_DB_PASSWORD"
)

ERRORS=0

for var in "${ENV_VARS[@]}"; do
    check_env "$var" || ((ERRORS++))
done

# Verificar instalación de CLI
if ! command -v supabase &> /dev/null; then
    echo "${RED}❌ Supabase CLI no está instalado${NC}"
    ((ERRORS++))
else
    echo "${GREEN}✓ Supabase CLI instalado${NC}"
    check_supabase_connection || ((ERRORS++))
fi

# Verificar archivos de configuración
if [ -f "supabase/config.toml" ]; then
    echo "${GREEN}✓ Archivo de configuración encontrado${NC}"
else
    echo "${RED}❌ Falta archivo de configuración${NC}"
    ((ERRORS++))
fi

# Resumen
if [ $ERRORS -eq 0 ]; then
    echo "${GREEN}✅ Todas las verificaciones pasaron correctamente${NC}"
    exit 0
else
    echo "${RED}❌ Se encontraron $ERRORS errores${NC}"
    echo "${YELLOW}Ejecuta 'scripts/init-supabase.sh' para configurar Supabase${NC}"
    exit 1
fi 