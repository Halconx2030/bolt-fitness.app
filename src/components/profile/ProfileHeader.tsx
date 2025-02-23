'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Settings } from 'lucide-react';
import { ProfileEditDialog } from './ProfileEditDialog';

export function ProfileHeader() {
  const { user, level } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg" />

      <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
        <Avatar className="w-32 h-32 border-4 border-gray-900">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.nombre[0]}</AvatarFallback>
        </Avatar>

        <div className="mb-4 flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{user?.nombre}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Nivel {level}</span>
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ProfileEditDialog open={isEditing} onOpenChange={setIsEditing} />
    </div>
  );
}
