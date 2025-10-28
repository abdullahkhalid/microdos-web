import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ReactionButtonProps {
  postId: string;
  reactionCount: number;
  commentCount: number;
  hasReacted?: boolean;
  onCommentClick?: () => void;
  onShareClick?: () => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  postId,
  reactionCount,
  commentCount,
  hasReacted = false,
  onCommentClick,
  onShareClick,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReacting, setIsReacting] = useState(false);

  const reactionMutation = useMutation({
    mutationFn: async (action: 'like' | 'unlike') => {
      const response = await fetch(
        `https://microdos-web.vercel.app/api/community/posts/${postId}/reactions`,
        {
          method: action === 'like' ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user?.id || '',
            'X-User-Name': user?.name || '',
            'X-User-Email': user?.email || '',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
    onError: error => {
      console.error('Error reacting to post:', error);
    },
  });

  const handleReaction = async () => {
    if (!user) {
      alert('Bitte melde dich an, um Posts zu liken.');
      return;
    }

    setIsReacting(true);
    try {
      await reactionMutation.mutateAsync(hasReacted ? 'unlike' : 'like');
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReaction}
        disabled={isReacting}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
          hasReacted
            ? 'text-red-500 bg-red-50 hover:bg-red-100'
            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
        }`}
      >
        <Heart className={`w-4 h-4 ${hasReacted ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">
          {reactionCount > 0 ? reactionCount : ''}
        </span>
      </Button>

      {/* Comment Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {commentCount > 0 ? commentCount : ''}
        </span>
      </Button>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onShareClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Teilen</span>
      </Button>
    </div>
  );
};

export default ReactionButton;
