import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import NotificationBell from './NotificationBell';
import '../styles/mobile-navigation.css';
import { 
  Droplets, 
  LogOut, 
  User, 
  Calendar, 
  BarChart3, 
  Bell,
  Settings,
  Home,
  Menu,
  X,
  Leaf,
  MessageSquare,
  Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsAnimating(true);
    setMobileMenuOpen(false);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Touch event handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    // Only allow downward swipe
    if (deltaY > 0 && mobileMenuRef.current) {
      const translateY = Math.min(deltaY, 100); // Limit translation
      mobileMenuRef.current.style.transform = `translateY(${translateY}px)`;
      
      // Add opacity fade based on swipe distance
      const opacity = Math.max(0.3, 1 - (deltaY / 200));
      mobileMenuRef.current.style.opacity = opacity.toString();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    const deltaY = currentY.current - startY.current;
    
    // Close menu if swiped down more than 50px
    if (deltaY > 50) {
      closeMobileMenu();
    } else {
      // Reset position
      if (mobileMenuRef.current) {
        mobileMenuRef.current.style.transform = 'translateY(0)';
        mobileMenuRef.current.style.opacity = '1';
      }
    }
    
    isDragging.current = false;
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      closeMobileMenu();
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Navigation */}
      {showNavigation && (
        <nav className="bg-white border-b border-light-gray/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-turquoise rounded-medium flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-charcoal">
                  Microdos.in
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button 
                        variant="ghost"
                        className={`px-4 py-2 rounded-medium text-sm font-medium transition-all duration-200 ${
                          isActive('/dashboard') || isActive('/dashboard/analytics') || isActive('/dashboard/calendar') || isActive('/dashboard/protocols')
                            ? 'bg-turquoise/10 text-turquoise' 
                            : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                        }`}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Microdosing
                      </Button>
                    </Link>
                    <Link to="/community">
                      <Button 
                        variant="ghost"
                        className={`px-4 py-2 rounded-medium text-sm font-medium transition-all duration-200 ${
                          isActive('/community') || isActive('/community/posts') || isActive('/community/discussions') || isActive('/community/events')
                            ? 'bg-turquoise/10 text-turquoise' 
                            : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                        }`}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Community
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/legal-status">
                      <Button variant="ghost" className="px-4 py-2 rounded-medium text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200">
                        Rechtsstatus
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="ghost" className="px-4 py-2 rounded-medium text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200">
                        Anmelden
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="btn-primary text-sm">
                        Registrieren
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                {user && (
                  <div className="hidden md:flex items-center space-x-2 text-sm text-slate-gray">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                )}
                
                {user && (
                  <>
                    <NotificationBell />
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-medium text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (mobileMenuOpen) {
                      closeMobileMenu();
                    } else {
                      setMobileMenuOpen(true);
                    }
                  }}
                  className="md:hidden p-2 rounded-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <div className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                    <Menu className="menu-icon h-5 w-5" />
                    <X className="close-icon h-5 w-5" />
                  </div>
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Backdrop */}
            {mobileMenuOpen && (
              <div
                ref={backdropRef}
                onClick={handleBackdropClick}
                className={`fixed inset-0 bg-black/50 z-40 md:hidden backdrop ${
                  isAnimating ? 'backdrop-exit-active' : 'backdrop-enter-active'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Mobile Navigation Menu */}
            <div
              className={`fixed inset-x-0 top-16 z-50 md:hidden mobile-menu-container ${
                mobileMenuOpen 
                  ? 'mobile-menu-enter-active' 
                  : 'mobile-menu-exit-active pointer-events-none'
              }`}
              aria-hidden={!mobileMenuOpen}
            >
              <div
                ref={mobileMenuRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`bg-white border-t border-light-gray/50 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto mobile-menu-scroll swipe-feedback ${
                  isDragging.current ? 'swiping' : ''
                }`}
                style={{
                  transform: 'translateY(0)',
                  opacity: 1,
                  transition: isDragging.current ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
              >
                <div className="px-4 pt-4 pb-6 space-y-2">
                  {/* User info section */}
                  {user && (
                    <div className="flex items-center space-x-3 px-3 py-3 bg-soft-white/50 rounded-lg mb-4">
                      <div className="w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-turquoise" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-slate-gray">Angemeldet</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {user ? (
                      <>
                        <Link to="/dashboard" onClick={closeMobileMenu} className="mobile-menu-item block">
                          <Button 
                            variant="ghost"
                            className={`w-full justify-start px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive('/dashboard') || isActive('/dashboard/analytics') || isActive('/dashboard/calendar') || isActive('/dashboard/protocols')
                                ? 'bg-turquoise/10 text-turquoise border-l-4 border-turquoise' 
                                : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                            }`}
                          >
                            <Home className="h-5 w-5 mr-3" />
                            Microdosing
                          </Button>
                        </Link>
                        <Link to="/community" onClick={closeMobileMenu} className="mobile-menu-item block">
                          <Button 
                            variant="ghost"
                            className={`w-full justify-start px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive('/community') || isActive('/community/posts') || isActive('/community/discussions') || isActive('/community/events')
                                ? 'bg-turquoise/10 text-turquoise border-l-4 border-turquoise' 
                                : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                            }`}
                          >
                            <Users className="h-5 w-5 mr-3" />
                            Community
                          </Button>
                        </Link>
                        
                        {/* Divider */}
                        <div className="border-t border-light-gray/50 my-4" />
                        
                        {/* User actions */}
                        <div className="mobile-menu-item">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleLogout();
                              closeMobileMenu();
                            }}
                            className="w-full justify-start px-4 py-3 rounded-lg text-sm font-medium text-slate-gray hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            Abmelden
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/legal-status" onClick={closeMobileMenu} className="mobile-menu-item block">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-3 rounded-lg text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200"
                          >
                            Rechtsstatus
                          </Button>
                        </Link>
                        <Link to="/login" onClick={closeMobileMenu} className="mobile-menu-item block">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-3 rounded-lg text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200"
                          >
                            Anmelden
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={closeMobileMenu} className="mobile-menu-item block">
                          <Button className="w-full justify-start px-4 py-3 rounded-lg text-sm font-medium bg-turquoise text-white hover:bg-turquoise-dark transition-all duration-200">
                            Registrieren
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-light-gray/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-turquoise rounded-medium flex items-center justify-center">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-charcoal">
              Microdos.in
            </span>
          </div>
          <p className="text-slate-gray text-sm mb-4">
            Wissenschaftlich fundierte Mikrodosierungs-Berechnungen
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-gray">
            <span>© {new Date().getFullYear()} Microdos.in</span>
            <span>•</span>
            <Link to="/feedback" className="hover:text-turquoise transition-colors duration-200">Feedback</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-turquoise transition-colors duration-200">Datenschutz</Link>
            <span>•</span>
            <Link to="/imprint" className="hover:text-turquoise transition-colors duration-200">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
