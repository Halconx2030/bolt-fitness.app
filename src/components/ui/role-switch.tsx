'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, ChalkboardTeacher } from 'lucide-react';

interface RoleSwitchProps {
  currentRole: 'student' | 'teacher';
  onChange: () => void;
  disabled?: boolean;
}

export const RoleSwitch = ({ currentRole, onChange, disabled }: RoleSwitchProps) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
      <User
        className={`w-4 h-4 ${currentRole === 'student' ? 'text-yellow-400' : 'text-gray-400'}`}
      />
      <Switch
        checked={currentRole === 'teacher'}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-yellow-400"
      />
      <ChalkboardTeacher
        className={`w-4 h-4 ${currentRole === 'teacher' ? 'text-yellow-400' : 'text-gray-400'}`}
      />
      <Label className="text-sm text-gray-300">
        {currentRole === 'teacher' ? 'Modo Profesor' : 'Modo Estudiante'}
      </Label>
    </div>
  );
};
