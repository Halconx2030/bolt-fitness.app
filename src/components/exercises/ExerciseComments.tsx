'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { exerciseService } from '@/services/api/exercises';
import { useUser } from '@/hooks/useUser';

interface ExerciseCommentsProps {
  id: number;
}

export function ExerciseComments({ id }: ExerciseCommentsProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [id]);

  const loadComments = async () => {
    try {
      const data = await exerciseService.getExerciseComments(id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await exerciseService.addExerciseComment(id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await exerciseService.likeComment(commentId);
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1, liked: true }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  if (loading) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Comentarios</h2>

      <form onSubmit={handleSubmitComment} className="mb-6">
        <Textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
        <Button type="submit" className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Comentar
        </Button>
      </form>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex space-x-4 p-4 rounded-lg bg-gray-800/50"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user.avatar_url} />
                <AvatarFallback>{comment.user.nombre[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{comment.user.nombre}</p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(comment.fecha_creacion), {
                        addSuffix: true,
                        locale: es
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={comment.liked}
                    className={comment.liked ? 'text-yellow-400' : ''}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
                <p className="text-gray-300">{comment.contenido}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
} 