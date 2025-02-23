'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Send } from 'lucide-react';

interface User {
  name: string;
  image: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface ExerciseCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isLoading?: boolean;
}

const CommentSkeleton = () => (
  <div data-testid="comment-skeleton" className="flex items-start space-x-4 animate-pulse">
    <div className="h-10 w-10 bg-gray-700 rounded-full" />
    <div className="flex-1">
      <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
      <div className="h-3 w-full bg-gray-700 rounded" />
    </div>
  </div>
);

const ExerciseComments = ({ comments, onAddComment, isLoading = false }: ExerciseCommentsProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment);
    setNewComment('');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Comentarios</h3>
        {Array.from({ length: 2 }).map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Comentarios</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 bg-background rounded-lg px-4 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-primary rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Comentar</span>
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-center text-gray-400">No hay comentarios aún</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <article key={comment.id} className="flex items-start space-x-4">
              <Link href={`/profile/${comment.user.name}`}>
                <img
                  src={comment.user.image}
                  alt={comment.user.name}
                  className="h-10 w-10 rounded-full"
                />
              </Link>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/profile/${comment.user.name}`}
                    className="font-medium hover:text-primary"
                  >
                    {comment.user.name}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {format(new Date(comment.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>
                <p className="mt-1 text-gray-200">{comment.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseComments;
