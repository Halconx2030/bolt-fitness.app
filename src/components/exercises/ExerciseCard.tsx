'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  image: string;
  description: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
};

const truncateText = (text: string, maxLength: number = 72) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/exercises/${exercise.id}`}>
      <motion.div
        data-testid="exercise-card"
        className={`bg-secondary rounded-lg overflow-hidden transition-transform duration-300 ${
          isHovered ? 'transform scale-105' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video relative">
          <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
            <p className="text-sm text-gray-200">{exercise.muscleGroup}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColors[exercise.difficulty]}`}
            >
              {exercise.difficulty}
            </span>
            <span className="text-xs text-gray-400">{exercise.equipment}</span>
          </div>

          <p className="text-sm text-gray-400">{truncateText(exercise.description)}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default ExerciseCard;
