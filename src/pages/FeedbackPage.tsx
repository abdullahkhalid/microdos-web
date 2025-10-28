import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, MessageSquare, ThumbsUp, Plus, Edit, Trash2 } from 'lucide-react';
import { apiClient, Review, Suggestion } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'reviews' | 'suggestions'>('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', { sortBy, sortOrder, page }],
    queryFn: () => apiClient.getReviews({ sortBy, sortOrder, page, limit: 10 }),
  });

  // Fetch suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => apiClient.getSuggestions(),
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment: string }) => {
      // Add user information to the request if authenticated
      const headers: Record<string, string> = {};
      if (user) {
        headers['X-User-ID'] = user.id;
        headers['X-User-Name'] = user.name;
        headers['X-User-Email'] = user.email;
      }
      return apiClient.createReview(data, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setShowReviewForm(false);
      alert('Vielen Dank für deine Bewertung! Sie wurde erfolgreich gespeichert.');
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      alert('Fehler beim Erstellen der Bewertung: ' + error.message);
    },
  });


  // Create suggestion mutation
  const createSuggestionMutation = useMutation({
    mutationFn: (data: { title: string; description: string; category: 'UI/UX' | 'Features' | 'Microdoses' | 'Werbung' }) => {
      // Add user information to the request if authenticated
      const headers: Record<string, string> = {};
      if (user) {
        headers['X-User-ID'] = user.id;
        headers['X-User-Name'] = user.name;
        headers['X-User-Email'] = user.email;
      }
      return apiClient.createSuggestion(data, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      setShowSuggestionForm(false);
      alert('Vielen Dank für deinen Vorschlag! Er wurde erfolgreich gespeichert.');
    },
    onError: (error) => {
      console.error('Error creating suggestion:', error);
      alert('Fehler beim Erstellen des Vorschlags: ' + error.message);
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => {
      // Add user information to the request if authenticated
      const headers: Record<string, string> = {};
      if (user) {
        headers['X-User-ID'] = user.id;
        headers['X-User-Name'] = user.name;
        headers['X-User-Email'] = user.email;
      }
      return apiClient.deleteReview(reviewId, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      alert('Bewertung wurde erfolgreich gelöscht.');
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      alert('Fehler beim Löschen der Bewertung: ' + error.message);
    },
  });

  // Delete suggestion mutation
  const deleteSuggestionMutation = useMutation({
    mutationFn: (suggestionId: string) => {
      // Add user information to the request if authenticated
      const headers: Record<string, string> = {};
      if (user) {
        headers['X-User-ID'] = user.id;
        headers['X-User-Name'] = user.name;
        headers['X-User-Email'] = user.email;
      }
      return apiClient.deleteSuggestion(suggestionId, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      alert('Vorschlag wurde erfolgreich gelöscht.');
    },
    onError: (error) => {
      console.error('Error deleting suggestion:', error);
      alert('Fehler beim Löschen des Vorschlags: ' + error.message);
    },
  });

  // Toggle like mutations
  const toggleReviewLikeMutation = useMutation({
    mutationFn: apiClient.toggleReviewLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const toggleSuggestionLikeMutation = useMutation({
    mutationFn: apiClient.toggleSuggestionLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`transition-colors duration-200 ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) {
        alert('Bitte wählen Sie eine Bewertung aus.');
        return;
      }
      if (!comment.trim()) {
        alert('Bitte geben Sie einen Kommentar ein.');
        return;
      }
      createReviewMutation.mutate({ rating, comment });
      setRating(0);
      setComment('');
    };

    return (
      <Card className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-turquoise-600 to-lilac-600 bg-clip-text text-transparent">
          Bewertung abgeben
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bewertung
            </label>
            {renderStars(rating, true, setRating)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kommentar
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Teile deine Erfahrungen mit uns..."
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={rating === 0 || createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? 'Wird gespeichert...' : 'Bewertung abgeben'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const SuggestionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('UI/UX');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        alert('Bitte geben Sie einen Titel ein.');
        return;
      }
      if (!description.trim()) {
        alert('Bitte geben Sie eine Beschreibung ein.');
        return;
      }
      createSuggestionMutation.mutate({ title, description, category: category as 'UI/UX' | 'Features' | 'Microdoses' | 'Werbung' });
      setTitle('');
      setDescription('');
      setCategory('UI/UX');
    };

    return (
      <Card className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-turquoise-600 to-lilac-600 bg-clip-text text-transparent">
          Verbesserungsvorschlag einreichen
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent"
              placeholder="Kurze Beschreibung deines Vorschlags"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent"
            >
              <option value="UI/UX">UI/UX</option>
              <option value="Features">Features</option>
              <option value="Microdoses">Microdoses</option>
              <option value="Werbung">Werbung</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Beschreibe deinen Vorschlag im Detail..."
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={createSuggestionMutation.isPending}
            >
              {createSuggestionMutation.isPending ? 'Wird gespeichert...' : 'Vorschlag einreichen'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSuggestionForm(false)}
              className="px-6 py-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const ReviewCard = ({ review }: { review: Review }) => {
    const isOwnReview = user?.id && review.userId === user.id;
    const hasLiked = user?.id && review.likes.some(like => like.userId === user.id);

    return (
      <Card className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-turquoise-500 to-lilac-500 rounded-full flex items-center justify-center text-white font-semibold">
              {review.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {renderStars(review.rating)}
            <Badge className="bg-gradient-to-r from-turquoise-100 to-lilac-100 text-turquoise-700 border-0">
              {review.rating}/5
            </Badge>
          </div>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => toggleReviewLikeMutation.mutate(review.id)}
            className={`flex items-center space-x-2 transition-colors ${
              hasLiked ? 'text-turquoise-600' : 'text-gray-500 hover:text-turquoise-600'
            }`}
            disabled={toggleReviewLikeMutation.isPending}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{review.likes.length}</span>
          </button>
          {isOwnReview && (
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-turquoise-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (confirm('Möchtest du diese Bewertung wirklich löschen?')) {
                    deleteReviewMutation.mutate(review.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                disabled={deleteReviewMutation.isPending}
                title="Bewertung löschen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const SuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => {
    const isOwnSuggestion = user?.id && suggestion.userId === user.id;
    const hasLiked = user?.id && suggestion.likes.some(like => like.userId === user.id);

    return (
      <Card className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
            <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-0">
              {suggestion.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(suggestion.createdAt).toLocaleDateString('de-DE')}
          </p>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">{suggestion.description}</p>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => toggleSuggestionLikeMutation.mutate(suggestion.id)}
            className={`flex items-center space-x-2 transition-colors ${
              hasLiked ? 'text-turquoise-600' : 'text-gray-500 hover:text-turquoise-600'
            }`}
            disabled={toggleSuggestionLikeMutation.isPending}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{suggestion.likes.length}</span>
          </button>
          {isOwnSuggestion && (
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-turquoise-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (confirm('Möchtest du diesen Vorschlag wirklich löschen?')) {
                    deleteSuggestionMutation.mutate(suggestion.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                disabled={deleteSuggestionMutation.isPending}
                title="Vorschlag löschen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-turquoise-50 via-white to-lilac-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-turquoise-600 to-lilac-600 bg-clip-text text-transparent">
              Feedback & Bewertungen
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teile deine Erfahrungen mit uns und hilf uns dabei, die App kontinuierlich zu verbessern
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border-0">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-turquoise-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Bewertungen</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'suggestions'
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-turquoise-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Vorschläge</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Form */}
              {showReviewForm && <ReviewForm />}

              {/* Reviews Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Bewertungen</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sortieren nach:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent"
                    >
                      <option value="date">Datum</option>
                      <option value="rating">Bewertung</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-turquoise-500 focus:border-transparent"
                    >
                      <option value="desc">Absteigend</option>
                      <option value="asc">Aufsteigend</option>
                    </select>
                  </div>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Bewertung abgeben
                  </Button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid gap-6">
                {reviewsLoading ? (
                  <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-0 shadow-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-turquoise-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Lade Bewertungen...</p>
                  </Card>
                ) : !reviewsData?.reviews || reviewsData.reviews.length === 0 ? (
                  <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-0 shadow-xl">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Noch keine Bewertungen</h3>
                    <p className="text-gray-500 mb-6">Sei der Erste, der eine Bewertung abgibt!</p>
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Erste Bewertung abgeben
                    </Button>
                  </Card>
                ) : (
                  reviewsData.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-8">
              {/* Suggestion Form */}
              {showSuggestionForm && <SuggestionForm />}

              {/* Suggestions Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Deine Verbesserungsvorschläge</h2>
                <Button
                  onClick={() => setShowSuggestionForm(true)}
                  className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Vorschlag einreichen
                </Button>
              </div>

              {/* Suggestions List */}
              <div className="grid gap-6">
                {suggestionsLoading ? (
                  <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-0 shadow-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-turquoise-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Lade Vorschläge...</p>
                  </Card>
                ) : !suggestions || suggestions.length === 0 ? (
                  <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-0 shadow-xl">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Noch keine Vorschläge</h3>
                    <p className="text-gray-500 mb-6">Hilf uns dabei, die App zu verbessern!</p>
                    <Button
                      onClick={() => setShowSuggestionForm(true)}
                      className="bg-gradient-to-r from-turquoise-500 to-lilac-500 hover:from-turquoise-600 hover:to-lilac-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Ersten Vorschlag einreichen
                    </Button>
                  </Card>
                ) : (
                  suggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackPage;
