import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardTabNavigationProps {
  className?: string;
}

const tabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
  },
  {
    id: 'protocols',
    label: 'Protokolle',
    path: '/dashboard/protocols',
    icon: Calendar,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    id: 'calendar',
    label: 'Kalender',
    path: '/dashboard/calendar',
    icon: Clock,
  },
];

export const DashboardTabNavigation: React.FC<DashboardTabNavigationProps> = ({ 
  className = '' 
}) => {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  
  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard/protocols') return 'protocols';
    if (path === '/dashboard/analytics') return 'analytics';
    if (path === '/dashboard/calendar') return 'calendar';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and when active tab changes
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Auto-scroll to active tab
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        });
      }
    }
  }, [activeTab]);

  return (
    <div className={`mb-8 ${className}`}>
      {/* Desktop Layout - Single Row */}
      <div className="hidden md:block">
        <div className="flex space-x-1 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg max-w-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Layout - Optimized 2 Rows with Horizontal Scrolling */}
      <div className="md:hidden">
        {/* 2-Row Layout for Small Screens */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg mb-3">
          {/* First Row - 2 Tabs */}
          <div className="flex space-x-1 mb-1">
            {tabs.slice(0, 2).map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  data-tab-id={tab.id}
                  className={`flex-1 py-4 px-3 rounded-xl font-medium transition-all duration-300 text-center dashboard-tab ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg dashboard-tab-active'
                      : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon className="w-5 h-5 dashboard-tab-icon" />
                    <span className="text-xs font-medium dashboard-tab-text">{tab.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Second Row - 2 Tabs */}
          <div className="flex space-x-1">
            {tabs.slice(2, 4).map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  data-tab-id={tab.id}
                  className={`flex-1 py-4 px-3 rounded-xl font-medium transition-all duration-300 text-center dashboard-tab ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg dashboard-tab-active'
                      : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon className="w-5 h-5 dashboard-tab-icon" />
                    <span className="text-xs font-medium dashboard-tab-text">{tab.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrolling Layout for Better UX */}
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-turquoise-600 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-turquoise-600 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Horizontal Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg dashboard-tabs-mobile"
          >
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 dashboard-tabs-scroll">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    data-tab-id={tab.id}
                    className={`flex-shrink-0 py-3 px-4 rounded-xl font-medium transition-all duration-300 min-w-[140px] dashboard-tab-mobile dashboard-tab ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg dashboard-tab-active'
                        : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Icon className="w-4 h-4 dashboard-tab-icon" />
                      <span className="text-sm dashboard-tab-text">{tab.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabNavigation;
