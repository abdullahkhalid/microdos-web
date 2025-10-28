import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface UserCountBadgeProps {
  className?: string;
}

export const UserCountBadge: React.FC<UserCountBadgeProps> = ({ className = '' }) => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await apiClient.getUserCount();
        if (response.success) {
          setUserCount(response.count);
        }
      } catch (error) {
        console.error('Failed to fetch user count:', error);
        // Fallback to a default number if API fails
        setUserCount(2300);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-white/20 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white animate-pulse bg-slate-200"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white animate-pulse bg-slate-200"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white animate-pulse bg-slate-200"></div>
          </div>
          <div>
            <div className="text-white font-soft font-semibold text-sm">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayCount = userCount ? userCount.toLocaleString() : '2300+';

  return (
    <div className={`bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-white/20 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex -space-x-2">
          {/* Avatar 1 - Healthy, fit, intelligent white man */}
          <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face&auto=format&q=80"
              alt="Member avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Avatar 2 - Professional, healthy white man */}
          <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face&auto=format&q=80"
              alt="Member avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Avatar 3 - Smart, fit white man */}
          <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=32&h=32&fit=crop&crop=face&auto=format&q=80"
              alt="Member avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="text-white font-soft font-semibold text-sm">
            {displayCount} Mitglieder
          </div>
        </div>
      </div>
    </div>
  );
};
