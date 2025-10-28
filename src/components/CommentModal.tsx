import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Send, Heart, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    handle?: string;
    image?: string;
  };
  createdAt: string;
  reactionCount: number;
  hasReacted?: boolean;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(
        `https://microdos-web.vercel.app/api/community/posts/${postId}/comments`
      );
      return response.json();
    },
    enabled: isOpen,
  });

  const comments: Comment[] = commentsData?.comments || [];

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(
        `https://microdos-web.vercel.app/api/community/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user?.id || '',
            'X-User-Name': user?.name || '',
            'X-User-Email': user?.email || '',
          },
          credentials: 'include',
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      setNewComment('');
    },
    onError: error => {
      console.error('Error creating comment:', error);
      alert('Fehler beim Erstellen des Kommentars: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Bitte gib einen Kommentar ein.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createCommentMutation.mutateAsync(newComment.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kommentare</h2>
              {postTitle && (
                <p className="text-sm text-gray-600 mt-1">zu "{postTitle}"</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Lade Kommentare...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Noch keine Kommentare</p>
              <p className="text-sm text-gray-400 mt-1">
                Sei der Erste, der kommentiert!
              </p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-turquoise-500 to-lilac-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {comment.author.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(
                          'de-DE',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{comment.reactionCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        {user && (
          <div className="p-6 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-turquoise-500 to-lilac-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Schreibe einen Kommentar..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-turquoise-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    rows={3}
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newComment.length}/1000 Zeichen
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Wird gesendet...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Kommentieren</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CommentModal;
