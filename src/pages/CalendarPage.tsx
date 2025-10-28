import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { ProtocolCalendar } from '@/components/ProtocolCalendar';
import { 
  Calendar as CalendarIcon,
  Plus,
  ArrowLeft,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Home,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function CalendarPage() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
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

  // Fetch protocols
  const { data: protocolsData, isLoading: protocolsLoading } = useQuery({
    queryKey: ['protocols'],
    queryFn: () => apiClient.getProtocols(),
    enabled: !!user,
  });

  // Fetch all events from all protocols
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      if (!protocolsData?.protocols) return { events: [] };
      
      // Fetch events for each protocol
      const eventPromises = protocolsData.protocols.map(async (protocol: any) => {
        try {
          const response = await apiClient.getProtocol(protocol.id);
          return response.protocol.events || [];
        } catch (error) {
          console.error(`Error fetching events for protocol ${protocol.id}:`, error);
          return [];
        }
      });
      
      const allEvents = await Promise.all(eventPromises);
      return { events: allEvents.flat() };
    },
    enabled: !!protocolsData?.protocols,
  });

  const protocols = protocolsData?.protocols || [];
  const events = eventsData?.events || [];

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setSelectedProtocol(null);
  };

  const handleProtocolSelect = (protocol: any) => {
    setSelectedProtocol(protocol);
    setSelectedEvent(null);
  };

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'skipped':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getEventStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'missed':
        return 'Verpasst';
      case 'skipped':
        return 'Übersprungen';
      default:
        return 'Geplant';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0); // Remove time to avoid timezone issues
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (protocolsLoading || eventsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-96 bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            
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
                    <CalendarIcon className="w-4 h-4" />
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
                    <CalendarIcon className="w-4 h-4" />
                    <span>Kalender</span>
                  </div>
                </Link>
              </div>
            </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/protocols">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zu Protokollen
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-soft font-light text-slate-800">
                  Mikrodosierungs-
                  <span className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                    Kalender
                  </span>
                </h1>
                <p className="text-slate-600 font-soft">
                  Übersicht Ihrer Mikrodosierungs-Protokolle und Events
                </p>
              </div>
            </div>
            <Link to="/protocols/create">
              <Button className="rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Neues Protokoll
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <ProtocolCalendar
                protocols={protocols}
                events={events}
                onEventSelect={handleEventSelect}
                onProtocolSelect={handleProtocolSelect}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details */}
              {selectedEvent && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-calm-turquoise-100/30 to-calm-lilac-100/30 backdrop-blur-sm">
                    <CardTitle className="flex items-center font-soft">
                      <div className="w-8 h-8 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                      Event-Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Datum:</span>
                      <span className="font-soft text-slate-600">{formatDate(selectedEvent.start)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Typ:</span>
                      <span className="font-soft text-slate-600 capitalize">
                        {selectedEvent.type === 'dose' ? 'Einnahmetag' : 'Pausentag'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Status:</span>
                      <div className="flex items-center space-x-2">
                        {getEventStatusIcon(selectedEvent.status)}
                        <span className="font-soft text-slate-600">{getEventStatusText(selectedEvent.status)}</span>
                      </div>
                    </div>
                    
                    {selectedEvent.type === 'dose' && (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                          <span className="font-soft font-semibold text-slate-800">Substanz:</span>
                          <span className="font-soft text-slate-600 capitalize">{selectedEvent.substance}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                          <span className="font-soft font-semibold text-slate-800">Dosis:</span>
                          <span className="font-soft text-slate-600">
                            {selectedEvent.dose} {selectedEvent.doseUnit}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Protokoll:</span>
                      <span className="font-soft text-slate-600">{selectedEvent.protocolName}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Protocol Details */}
              {selectedProtocol && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-calm-lilac-100/30 to-calm-yellow-100/30 backdrop-blur-sm">
                    <CardTitle className="flex items-center font-soft">
                      <div className="w-8 h-8 bg-gradient-to-br from-calm-lilac-400 to-calm-yellow-400 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      Protokoll-Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Name:</span>
                      <span className="font-soft text-slate-600">{selectedProtocol.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Typ:</span>
                      <span className="font-soft text-slate-600 capitalize">{selectedProtocol.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Status:</span>
                      <span className="font-soft text-slate-600 capitalize">{selectedProtocol.status}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Start:</span>
                      <span className="font-soft text-slate-600">{formatDate(selectedProtocol.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Ende:</span>
                      <span className="font-soft text-slate-600">{formatDate(selectedProtocol.endDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                      <span className="font-soft font-semibold text-slate-800">Dauer:</span>
                      <span className="font-soft text-slate-600">{selectedProtocol.cycleLength} Wochen</span>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <Link to={`/protocols/${selectedProtocol.id}`}>
                        <Button className="w-full rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          Protokoll anzeigen
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-calm-yellow-100/30 to-calm-peach-100/30 backdrop-blur-sm">
                  <CardTitle className="flex items-center font-soft">
                    <div className="w-8 h-8 bg-gradient-to-br from-calm-yellow-400 to-calm-peach-400 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <span className="font-soft text-slate-700">Aktive Protokolle:</span>
                    <span className="font-soft font-semibold text-slate-800 bg-gradient-to-r from-calm-turquoise-100 to-calm-turquoise-200 px-3 py-1 rounded-full text-sm">
                      {protocols.filter((p: any) => p.status === 'active').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <span className="font-soft text-slate-700">Geplante Events:</span>
                    <span className="font-soft font-semibold text-slate-800 bg-gradient-to-r from-calm-lilac-100 to-calm-lilac-200 px-3 py-1 rounded-full text-sm">
                      {events.filter((e: any) => e.status === 'scheduled').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <span className="font-soft text-slate-700">Abgeschlossen:</span>
                    <span className="font-soft font-semibold text-green-600 bg-gradient-to-r from-green-100 to-green-200 px-3 py-1 rounded-full text-sm">
                      {events.filter((e: any) => e.status === 'completed').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <span className="font-soft text-slate-700">Verpasst:</span>
                    <span className="font-soft font-semibold text-red-600 bg-gradient-to-r from-red-100 to-red-200 px-3 py-1 rounded-full text-sm">
                      {events.filter((e: any) => e.status === 'missed').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-calm-peach-100/30 to-calm-turquoise-100/30 backdrop-blur-sm">
                  <CardTitle className="flex items-center font-soft">
                    <div className="w-8 h-8 bg-gradient-to-br from-calm-peach-400 to-calm-turquoise-400 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                    Hilfe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <p className="font-soft text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">Protokoll-Bereiche:</span> Zeigen den Zeitraum Ihrer Protokolle als subtile Hintergrundfarben.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <p className="font-soft text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">Events:</span> Klicken Sie auf Events für Details oder auf Protokoll-Bereiche für Protokoll-Informationen.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm">
                    <p className="font-soft text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">Farben:</span> Blau = geplant, Grün = abgeschlossen, Rot = verpasst, Grau = Pause.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
