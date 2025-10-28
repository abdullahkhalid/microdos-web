import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Users,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import CreatePostModal from '../components/CreatePostModal';
import ReactionButton from '../components/ReactionButton';
import SearchBar from '../components/SearchBar';
import CommentModal from '../components/CommentModal';
import { Link, useLocation } from 'react-router-dom';

interface Post {
  id: string;
  title?: string;
  content: string;
  author: {
    id: string;
    name: string;
    handle?: string;
    image?: string;
  };
  isPinned: boolean;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  createdAt: string;
  _count: {
    comments: number;
    reactions: number;
  };
}

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [sortBy, setSortBy] = useState<'new' | 'top' | 'trending'>('new');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostForComments, setSelectedPostForComments] = useState<{
    id: string;
    title?: string;
  } | null>(null);

  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/community/posts') return 'posts';
    if (path === '/community/discussions') return 'discussions';
    if (path === '/community/events') return 'events';
    return 'posts'; // default to posts
  };

  const activeTab = getActiveTab();

  // Fetch posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community', 'posts', sortBy, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('sort', sortBy);
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(
        `https://microdos-web.vercel.app/api/community/posts?${params.toString()}`
      );
      return response.json();
    },
  });

  const posts: Post[] = postsData?.posts || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Community Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg max-w-2xl">
                <Link
                  to="/community/posts"
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'posts'
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                      : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Posts</span>
                  </div>
                </Link>
                <Link
                  to="/community/discussions"
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'discussions'
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                      : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Diskussionen</span>
                  </div>
                </Link>
                <Link
                  to="/community/events"
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'events'
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                      : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Events</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              {activeTab === 'posts' && (
                <>
                  {/* Sort Options & Search Bar */}
                  <div className="p-3 md:p-4">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                      {/* Sort Buttons - Left */}
                      <div className="flex space-x-1 md:space-x-2">
                        {[
                          { key: 'new', label: 'Neu', icon: Clock },
                          { key: 'top', label: 'Top', icon: Star },
                          {
                            key: 'trending',
                            label: 'Trending',
                            icon: TrendingUp,
                          },
                        ].map(({ key, label, icon: Icon }) => (
                          <button
                            key={key}
                            onClick={() => setSortBy(key as any)}
                            className={`flex items-center space-x-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl font-soft font-medium transition-all duration-300 text-xs md:text-sm ${
                              sortBy === key
                                ? 'bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 text-white shadow-md'
                                : 'text-slate-600 hover:text-calm-turquoise-600 hover:bg-calm-turquoise-50'
                            }`}
                          >
                            <Icon className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Search Bar - Center */}
                      <div className="flex-1 w-full md:w-auto">
                        <SearchBar
                          onSearch={handleSearch}
                          placeholder="Suche in Posts..."
                          className="w-full max-w-md mx-auto"
                        />
                      </div>

                      {/* New Post Button - Right */}
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white rounded-lg md:rounded-xl font-soft px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm whitespace-nowrap"
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden sm:inline">Neuer Post</span>
                        <span className="sm:hidden">Post</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'discussions' && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-10 h-10 text-calm-turquoise-600" />
                  </div>
                  <h3 className="text-2xl font-soft font-semibold text-slate-800 mb-4">
                    Diskussionen
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg font-soft">
                    Tiefgreifende Diskussionen über Mikrodosierung und verwandte
                    Themen.
                  </p>
                  <p className="text-slate-500 text-sm font-soft">
                    Bald verfügbar...
                  </p>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-10 h-10 text-calm-turquoise-600" />
                  </div>
                  <h3 className="text-2xl font-soft font-semibold text-slate-800 mb-4">
                    Events
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg font-soft">
                    Community-Events, Meetups und Veranstaltungen rund um
                    Mikrodosierung.
                  </p>
                  <p className="text-slate-500 text-sm font-soft">
                    Bald verfügbar...
                  </p>
                </div>
              )}

              {/* Posts List - Only show for posts tab */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {postsLoading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calm-turquoise-500 mx-auto mb-6"></div>
                      <p className="text-slate-500 font-soft">Lade Posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <MessageSquare className="w-10 h-10 text-calm-turquoise-600" />
                        </div>
                        <h3 className="text-2xl font-soft font-semibold text-slate-800 mb-4">
                          Noch keine Posts
                        </h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg font-soft">
                          Sei der Erste, der einen Post in der Community teilt
                          und andere inspirierst!
                        </p>
                        <Button
                          onClick={() => setShowCreateModal(true)}
                          className="rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-soft"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Ersten Post erstellen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    posts.map(post => (
                      <div
                        key={post.id}
                        className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 hover:shadow-2xl group transition-all duration-300"
                      >
                        <div className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center text-white font-soft font-semibold shadow-lg group-hover:scale-110 transition-transform duration-200">
                                {post.author.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-soft font-semibold text-slate-800 text-lg">
                                  {post.author.name}
                                </h4>
                                <p className="text-sm text-slate-500 font-soft">
                                  {new Date(post.createdAt).toLocaleDateString(
                                    'de-DE'
                                  )}
                                </p>
                              </div>
                            </div>
                            {post.isPinned && (
                              <Badge className="bg-gradient-to-r from-calm-turquoise-100 to-calm-lilac-100 text-calm-turquoise-700 border-0 rounded-xl font-soft">
                                Gepinnt
                              </Badge>
                            )}
                          </div>

                          {post.title && (
                            <h3 className="text-xl font-soft font-semibold text-slate-800 mb-4">
                              {post.title}
                            </h3>
                          )}

                          <p className="text-slate-700 mb-6 leading-relaxed line-clamp-3 font-soft">
                            {post.content}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <ReactionButton
                                postId={post.id}
                                reactionCount={post.reactionCount}
                                commentCount={post.commentCount}
                                hasReacted={false} // TODO: Implement user reaction tracking
                                onCommentClick={() => {
                                  setSelectedPostForComments({
                                    id: post.id,
                                    title: post.title,
                                  });
                                }}
                                onShareClick={() => {
                                  // TODO: Implement share functionality
                                  if (navigator.share) {
                                    navigator.share({
                                      title: post.title || 'Community Post',
                                      text: post.content,
                                      url: window.location.href,
                                    });
                                  } else {
                                    navigator.clipboard.writeText(
                                      window.location.href
                                    );
                                    alert(
                                      'Link in die Zwischenablage kopiert!'
                                    );
                                  }
                                }}
                              />
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 font-soft">
                              <span>{post.viewCount} Aufrufe</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={!!selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
        postId={selectedPostForComments?.id || ''}
        postTitle={selectedPostForComments?.title}
      />
    </Layout>
  );
};

export default CommunityPage;
