import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp } from 'lucide-react';
import { apiClient, Review } from '../lib/api';

const TopReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['topReviews'],
    queryFn: () => apiClient.getTopReviews(),
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [reviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-calm-yellow-400 fill-calm-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="px-6 py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calm-turquoise-500 mx-auto mb-4"></div>
            <p className="text-slate-500 font-soft">Lade Bewertungen...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-24 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-soft font-light text-slate-800 mb-4">
            Was unsere Nutzer sagen
          </h2>
          <p className="text-slate-600 font-soft text-lg max-w-2xl mx-auto">
            Echte Erfahrungen von Menschen, die ihre Mikrodosierung mit uns optimieren
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div key={review.id} className="w-full flex-shrink-0 px-4">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reviews.slice(index, index + 4).map((reviewItem, itemIndex) => {
                      const isEven = (index + itemIndex) % 2 === 0;
                      return (
                        <div
                          key={reviewItem.id}
                          className={`transform transition-all duration-1000 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                          }`}
                          style={{
                            animationDelay: `${itemIndex * 200}ms`,
                            transform: isEven ? 'translateX(0)' : 'translateX(0)',
                          }}
                        >
                          <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 hover:border-calm-lilac-200 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                  <span className="text-slate-700 text-lg font-semibold">
                                    {reviewItem.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-lg font-soft font-semibold text-slate-800">
                                    {reviewItem.user.name}
                                  </h4>
                                  <p className="text-slate-500 font-soft text-sm">
                                    {new Date(reviewItem.createdAt).toLocaleDateString('de-DE')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {renderStars(reviewItem.rating)}
                                <span className="text-sm font-medium text-slate-600 font-soft">
                                  {reviewItem.rating}/5
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-slate-600 leading-relaxed font-soft text-sm mb-6 line-clamp-4">
                              "{reviewItem.comment}"
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <button className="flex items-center space-x-2 text-slate-500 hover:text-calm-lilac-600 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-sm font-soft">{reviewItem.likes.length}</span>
                              </button>
                              <div className="flex space-x-1">
                                {renderStars(reviewItem.rating)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 shadow-lg'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Continuous scrolling effect for smaller screens */}
        <div className="mt-12 md:hidden">
          <div className="overflow-hidden">
            <div className="flex space-x-6 animate-scroll">
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 w-80 group p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 hover:border-calm-lilac-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <span className="text-slate-700 text-sm font-semibold">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-soft font-semibold text-slate-800">{review.user.name}</h4>
                        <p className="text-slate-500 font-soft text-sm">
                          {new Date(review.createdAt).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-slate-600 font-soft">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed font-soft text-sm line-clamp-3">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-slate-500 hover:text-calm-lilac-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-soft">{review.likes.length}</span>
                    </button>
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TopReviews;
