#!/bin/bash

# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Crear archivo .env si no existe
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Instalar husky
npm run prepare 