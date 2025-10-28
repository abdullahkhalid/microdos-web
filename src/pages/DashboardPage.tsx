import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MicrodoseProfile } from '@/components/MicrodoseProfile';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Layout } from '@/components/Layout';
import { User, Mail, Calendar, Calculator, Activity, Plus, Clock, BarChart3, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Link, useLocation } from 'react-router-dom';
import { AnalyticsPage } from './AnalyticsPage';
import { CalendarPage } from './CalendarPage';
import { ProtocolsPage } from './ProtocolsPage';

export function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard/protocols') return 'protocols';
    if (path === '/dashboard/analytics') return 'analytics';
    if (path === '/dashboard/calendar') return 'calendar';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();

  // Fetch user activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => apiClient.getActivities(),
    enabled: !!user,
  });

  // Helper function to format time
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Helper function to get activity icon and color
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'account_created':
        return { icon: User, color: 'bg-turquoise/10 text-turquoise' };
      case 'microdose_calculated':
        return { icon: Calculator, color: 'bg-coral/10 text-coral' };
      case 'email_verified':
        return { icon: Mail, color: 'bg-slate-gray/10 text-slate-gray' };
      default:
        return { icon: Activity, color: 'bg-light-gray/50 text-slate-gray' };
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg max-w-2xl">
              <Link
                to="/dashboard"
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/dashboard/protocols"
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'protocols'
                    ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Protokolle</span>
                </div>
              </Link>
              <Link
                to="/dashboard/analytics"
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </div>
              </Link>
              <Link
                to="/dashboard/calendar"
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-turquoise-500 to-lilac-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-turquoise-600 hover:bg-turquoise-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Kalender</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-soft font-light text-slate-800 mb-3">
                Willkommen zurück, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-slate-600 text-lg font-soft">
                Hier ist Ihr Überblick für heute.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link to="/protocols/create">
                <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 p-6 hover:shadow-2xl cursor-pointer group transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-soft font-semibold text-slate-800">Neues Protokoll</h3>
                      <p className="text-sm text-slate-600 font-soft">Erstellen Sie ein Mikrodosierungs-Protokoll</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/daily">
                <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 p-6 hover:shadow-2xl cursor-pointer group transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-calm-lilac-400 to-calm-yellow-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-soft font-semibold text-slate-800">Heute</h3>
                      <p className="text-sm text-slate-600 font-soft">Tagesansicht und Tracking</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/dashboard/analytics">
                <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 p-6 hover:shadow-2xl cursor-pointer group transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-calm-yellow-400 to-calm-peach-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-soft font-semibold text-slate-800">Analytics</h3>
                      <p className="text-sm text-slate-600 font-soft">Fortschritt und Trends</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* User Info Card */}
            <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-soft font-semibold text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      Profil
                    </h2>
                    <p className="text-slate-600 font-soft">Ihre Kontoinformationen</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center shadow-lg">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name} 
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-calm-turquoise-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-soft font-semibold text-slate-800">{user?.name}</h3>
                    <p className="text-slate-600 font-soft">{user?.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-calm-turquoise-600" />
                        <span className="text-sm text-slate-600 font-soft">E-Mail verifiziert</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-calm-turquoise-600" />
                        <span className="text-sm text-slate-600 font-soft">Mitglied seit heute</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Microdose Profile */}
            <MicrodoseProfile />

            {/* Protocols Section */}
            <div className="card-elevated mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-charcoal flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-turquoise" />
                      Meine Protokolle
                    </h2>
                    <p className="text-slate-gray">Verwalten Sie Ihre Mikrodosierungs-Protokolle</p>
                  </div>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-turquoise/10 rounded-large flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-turquoise" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-3">Noch keine Protokolle</h3>
                  <p className="text-slate-gray mb-6 max-w-md mx-auto">
                    Erstellen Sie Ihr erstes Mikrodosierungs-Protokoll für eine strukturierte und wissenschaftlich fundierte Praxis.
                  </p>
                  <Link to="/protocols/create">
                    <Button className="btn-primary px-8 py-4 text-lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Erstes Protokoll erstellen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <NotificationCenter className="mb-8" />

            {/* Recent Activity */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-charcoal flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-turquoise" />
                    Letzte Aktivitäten
                  </h2>
                  <p className="text-slate-gray">Ihre neuesten Kontaktaktivitäten</p>
                </div>
                
                {activitiesLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-soft-white rounded-medium">
                      <div className="w-10 h-10 loading-pulse rounded-medium"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 loading-pulse w-3/4"></div>
                        <div className="h-3 loading-pulse w-1/2"></div>
                      </div>
                      <div className="h-3 loading-pulse w-16"></div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-soft-white rounded-medium">
                      <div className="w-10 h-10 loading-pulse rounded-medium"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 loading-pulse w-2/3"></div>
                        <div className="h-3 loading-pulse w-3/4"></div>
                      </div>
                      <div className="h-3 loading-pulse w-16"></div>
                    </div>
                  </div>
                ) : activitiesData?.activities && activitiesData.activities.length > 0 ? (
                  <div className="space-y-3">
                    {activitiesData.activities.map((activity: any) => {
                      const { icon: IconComponent, color } = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-soft-white rounded-medium hover-lift">
                          <div className={`w-10 h-10 ${color} rounded-medium flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-charcoal">{activity.title}</p>
                            <p className="text-sm text-slate-gray">{activity.description}</p>
                          </div>
                          <span className="text-sm text-slate-gray">{formatTimeAgo(activity.createdAt)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-light-gray/50 rounded-large flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-8 w-8 text-slate-gray" />
                    </div>
                    <p className="text-slate-gray font-medium">Noch keine Aktivitäten</p>
                    <p className="text-sm text-slate-gray">Ihre Aktivitäten werden hier angezeigt</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {activeTab === 'protocols' && (
            <div className="max-w-6xl mx-auto">
              <ProtocolsPage />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto">
              <AnalyticsPage />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="max-w-6xl mx-auto">
              <CalendarPage />
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
