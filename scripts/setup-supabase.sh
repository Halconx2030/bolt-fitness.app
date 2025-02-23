#!/bin/bash

# Verificar si Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "Instalando Supabase CLI..."
    npm install -g supabase-cli
fi

# Iniciar Supabase
echo "Iniciando servicios de Supabase..."
supabase init
supabase start

# Obtener URL y llaves
echo "Obteniendo credenciales..."
supabase status

# Generar tipos de TypeScript
echo "Generando tipos de TypeScript..."
supabase gen types typescript --local > src/types/supabase.ts

echo "Configuración completada!" 