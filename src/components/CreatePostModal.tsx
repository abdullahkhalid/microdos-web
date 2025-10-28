import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  X, 
  Image, 
  Link, 
  Smile, 
  Send,
  Plus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title?: string; content: string }) => {
      console.log('Creating post with data:', postData);
      console.log('User data:', user);
      
      // For testing purposes, allow posts without authentication
      if (!user) {
        console.warn('User not authenticated, using fallback values');
      }

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user?.id || 'anonymous-user',
          'X-User-Name': user?.name || 'Anonymous User',
          'X-User-Email': user?.email || 'anonymous@example.com',
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const result = await response.json();
      console.log('Success response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Post created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      setTitle('');
      setContent('');
      onClose();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      alert('Fehler beim Erstellen des Posts: ' + error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow posts without authentication for testing
    if (!user) {
      console.warn('User not authenticated, proceeding with anonymous post');
    }
    
    if (!content.trim()) {
      alert('Bitte gib einen Inhalt für deinen Post ein.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPostMutation.mutateAsync({
        title: title.trim() || undefined,
        content: content.trim()
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test API connection on component mount
  React.useEffect(() => {
    if (isOpen) {
      console.log('CreatePostModal opened');
      console.log('Current user:', user);
      console.log('API base URL:', window.location.origin);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-soft font-semibold text-slate-800">Neuen Post erstellen</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center text-white font-soft font-semibold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-soft font-semibold text-slate-800 text-lg">{user?.name || 'Benutzer'}</h3>
              <p className="text-sm text-slate-500 font-soft">Teile deine Erfahrungen mit der Community</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Titel (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-calm-turquoise-500 focus:border-transparent outline-none transition-all duration-200 font-soft"
                maxLength={200}
              />
              <p className="text-xs text-slate-500 mt-2 font-soft">{title.length}/200 Zeichen</p>
            </div>

            {/* Content */}
            <div>
              <textarea
                placeholder="Was möchtest du mit der Community teilen?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-calm-turquoise-500 focus:border-transparent outline-none transition-all duration-200 resize-none font-soft"
                rows={6}
                maxLength={2000}
                required
              />
              <p className="text-xs text-slate-500 mt-2 font-soft">{content.length}/2000 Zeichen</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:bg-slate-100 rounded-2xl"
                  title="Bild hinzufügen"
                >
                  <Image className="w-5 h-5 text-slate-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:bg-slate-100 rounded-2xl"
                  title="Link hinzufügen"
                >
                  <Link className="w-5 h-5 text-slate-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:bg-slate-100 rounded-2xl"
                  title="Emoji hinzufügen"
                >
                  <Smile className="w-5 h-5 text-slate-500" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="font-soft"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-6 py-3 rounded-2xl font-soft shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Wird erstellt...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Posten</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
