import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { DailyView } from '@/components/DailyView';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function DailyPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(
    date ? new Date(date) : new Date()
  );

  // Fetch all protocols and events
  const { data: protocolsData } = useQuery({
    queryKey: ['protocols'],
    queryFn: () => apiClient.getProtocols(),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['all-events'],
    queryFn: async () => {
      if (!protocolsData?.protocols) return { events: [] };
      
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

  const events = eventsData?.events || [];

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // Format date as YYYY-MM-DD without timezone issues
    const dateString = newDate.getFullYear() + '-' + 
      String(newDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(newDate.getDate()).padStart(2, '0');
    navigate(`/daily/${dateString}`);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    handleDateChange(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    handleDateChange(nextDay);
  };

  const handleToday = () => {
    handleDateChange(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/calendar">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:border-slate-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Kalender
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {formatDate(currentDate)}
                </h1>
                <p className="text-slate-600">
                  {isToday ? 'Heute' : 'Tagesansicht'}
                </p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:border-slate-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Date Navigation */}
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousDay}
                  className="rounded-xl border-slate-200 hover:border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Vorheriger Tag
                </Button>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {currentDate.getDate()}
                    </div>
                    <div className="text-sm text-slate-600">
                      {currentDate.toLocaleDateString('de-DE', { month: 'short' })}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900">
                      {currentDate.toLocaleDateString('de-DE', { weekday: 'long' })}
                    </div>
                    <div className="text-sm text-slate-600">
                      {currentDate.getFullYear()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isToday && (
                    <Button
                      variant="outline"
                      onClick={handleToday}
                      className="rounded-xl border-slate-200 hover:border-slate-300"
                    >
                      Heute
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleNextDay}
                    className="rounded-xl border-slate-200 hover:border-slate-300"
                  >
                    Nächster Tag
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily View */}
          <DailyView
            date={currentDate}
            events={events}
            onEventUpdate={(eventId, updates) => {
              console.log('Event update:', eventId, updates);
              // TODO: Implement event update API call
            }}
          />

          {/* Quick Actions */}
          <Card className="mt-8 border-0 shadow-xl bg-white/95 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schnellaktionen
              </CardTitle>
              <CardDescription>
                Häufig verwendete Funktionen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/calendar">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 hover:border-slate-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Kalender-Ansicht
                  </Button>
                </Link>
                <Link to="/protocols">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 hover:border-slate-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Protokolle verwalten
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 hover:border-slate-300"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
