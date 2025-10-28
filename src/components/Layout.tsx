import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import NotificationBell from './NotificationBell';
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
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-medium text-slate-gray hover:text-charcoal hover:bg-soft-white transition-all duration-200"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-light-gray/50 bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 rounded-medium text-sm font-medium ${
                            isActive('/dashboard') || isActive('/dashboard/analytics') || isActive('/dashboard/calendar') || isActive('/dashboard/protocols')
                              ? 'bg-turquoise/10 text-turquoise' 
                              : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                          }`}
                        >
                          <Home className="h-4 w-4 mr-3" />
                          Microdosing
                        </Button>
                      </Link>
                      <Link to="/community" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 rounded-medium text-sm font-medium ${
                            isActive('/community') || isActive('/community/posts') || isActive('/community/discussions') || isActive('/community/events')
                              ? 'bg-turquoise/10 text-turquoise' 
                              : 'text-slate-gray hover:text-charcoal hover:bg-soft-white'
                          }`}
                        >
                          <Users className="h-4 w-4 mr-3" />
                          Community
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/legal-status" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-medium text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white">
                          Rechtsstatus
                        </Button>
                      </Link>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-medium text-sm font-medium text-slate-gray hover:text-charcoal hover:bg-soft-white">
                          Anmelden
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start px-3 py-2 rounded-medium text-sm font-medium btn-primary">
                          Registrieren
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
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
