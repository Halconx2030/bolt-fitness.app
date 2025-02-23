import { cache } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

interface ExerciseFilters {
  muscleGroup?: string;
  difficulty?: string;
  equipment?: string;
  search?: string;
}

// Función cacheada para obtener ejercicios
export const getExercises = cache(async (filters: ExerciseFilters) => {
  const cacheKey = `exercises:${JSON.stringify(filters)}`;

  // Intentar obtener del cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached as string);
  }

  const supabase = createServerComponentClient();
  let query = supabase.from('exercises').select('*');

  // Aplicar filtros
  if (filters.muscleGroup) {
    query = query.eq('muscleGroup', filters.muscleGroup);
  }
  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters.equipment) {
    query = query.eq('equipment', filters.equipment);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching exercises: ${error.message}`);
  }

  // Guardar en cache por 1 hora
  await redis.set(cacheKey, JSON.stringify(data), { ex: 3600 });

  return data;
});

// Función para crear un ejercicio
export async function createExercise(exercise: Partial<Exercise>) {
  const supabase = createServerComponentClient();

  const { data, error } = await supabase.from('exercises').insert([exercise]).select().single();

  if (error) {
    throw new Error(`Error creating exercise: ${error.message}`);
  }

  // Invalidar cache relacionado
  await redis.del('exercises:*');

  return data;
}

// Función para actualizar un ejercicio
export async function updateExercise(id: string, exercise: Partial<Exercise>) {
  const supabase = createServerComponentClient();

  const { data, error } = await supabase
    .from('exercises')
    .update(exercise)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating exercise: ${error.message}`);
  }

  // Invalidar cache relacionado
  await redis.del('exercises:*');

  return data;
}

// Función para eliminar un ejercicio
export async function deleteExercise(id: string) {
  const supabase = createServerComponentClient();

  const { error } = await supabase.from('exercises').delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting exercise: ${error.message}`);
  }

  // Invalidar cache relacionado
  await redis.del('exercises:*');

  return true;
}

// Función para obtener un ejercicio por ID
export const getExerciseById = cache(async (id: string) => {
  const cacheKey = `exercise:${id}`;

  // Intentar obtener del cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached as string);
  }

  const supabase = createServerComponentClient();
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();

  if (error) {
    throw new Error(`Error fetching exercise: ${error.message}`);
  }

  // Guardar en cache por 1 hora
  await redis.set(cacheKey, JSON.stringify(data), { ex: 3600 });

  return data;
});
