#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🚀 Iniciando configuración de Supabase..."

# Verificar dependencias
if ! command -v supabase &> /dev/null; then
    echo "${RED}Supabase CLI no encontrado. Instalando...${NC}"
    npm install -g supabase
fi

# Inicializar proyecto Supabase
echo "📦 Inicializando proyecto Supabase..."
supabase init

# Crear archivo de configuración local
echo "🔧 Creando archivo de configuración..."
cat > supabase/config.toml << EOL
project_id = "your-project-id"
[api]
enabled = true
port = 54321
schemas = ["public", "auth"]
extra_search_path = ["public", "extensions"]
[db]
port = 54322
shadow_port = 54320
[studio]
enabled = true
port = 54323
EOL

# Crear esquema de base de datos
echo "🗄️ Creando esquema de base de datos..."
cat > supabase/migrations/00000000000000_init.sql << EOL
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    nivel INTEGER DEFAULT 1,
    puntos_totales INTEGER DEFAULT 0,
    ejercicios_completados INTEGER DEFAULT 0,
    racha_actual INTEGER DEFAULT 0,
    mejor_racha INTEGER DEFAULT 0,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE public.exercises (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    nivel_requerido TEXT NOT NULL,
    puntos INTEGER NOT NULL,
    tiempo_estimado INTEGER,
    categoria TEXT NOT NULL,
    completado_por INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE public.comments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    contenido TEXT NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Exercises policies
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
    FOR SELECT USING (true);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments
    FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EOL

# Iniciar Supabase
echo "🌟 Iniciando servicios de Supabase..."
supabase start

# Generar tipos TypeScript
echo "📝 Generando tipos TypeScript..."
supabase gen types typescript --local > src/types/supabase.ts

# Crear archivo de variables de entorno
echo "🔐 Creando archivo .env..."
supabase status -o env > .env.local

echo "${GREEN}✅ Configuración completada!${NC}"
echo "
Próximos pasos:
1. Revisa el archivo .env.local y actualiza las variables necesarias
2. Ejecuta 'npm run dev' para iniciar el proyecto
3. Visita http://localhost:54323 para acceder a Supabase Studio
" 