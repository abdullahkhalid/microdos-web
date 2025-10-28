import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  Pause, 
  Play,
  Trash2,
  Eye,
  Zap,
  Brain,
  Settings,
  Home,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function ProtocolsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const { data: protocolsData, isLoading } = useQuery({
    queryKey: ['protocols'],
    queryFn: () => apiClient.getProtocols(),
    enabled: !!user,
  });

  const deleteProtocolMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteProtocol(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: 'Protokoll gelöscht',
        description: response.message || 'Das Protokoll wurde erfolgreich gelöscht.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.response?.data?.message || 'Das Protokoll konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteProtocol = (protocolId: string, protocolName: string) => {
    if (window.confirm(`Möchten Sie das Protokoll "${protocolName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      deleteProtocolMutation.mutate(protocolId);
    }
  };

  const getProtocolIcon = (type: string) => {
    switch (type) {
      case 'fadiman':
        return <Zap className="w-5 h-5" />;
      case 'stamets':
        return <Brain className="w-5 h-5" />;
      case 'custom':
        return <Settings className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getProtocolColor = (type: string) => {
    switch (type) {
      case 'fadiman':
        return 'bg-turquoise/10 text-turquoise';
      case 'stamets':
        return 'bg-coral/10 text-coral';
      case 'custom':
        return 'bg-slate-gray/10 text-slate-gray';
      default:
        return 'bg-light-gray/50 text-slate-gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-turquoise" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-coral" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-slate-gray" />;
      default:
        return <Clock className="w-4 h-4 text-slate-gray" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'paused':
        return 'Pausiert';
      case 'completed':
        return 'Abgeschlossen';
      default:
        return 'Unbekannt';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateProgress = (protocol: any) => {
    const startDate = new Date(protocol.startDate);
    const endDate = new Date(protocol.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const passedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const progress = Math.min(Math.max((passedDays / totalDays) * 100, 0), 100);
    return Math.round(progress);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="h-8 bg-white/60 backdrop-blur-sm rounded-2xl w-1/3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-white/60 backdrop-blur-sm rounded-3xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const protocols = protocolsData?.protocols || [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
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

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-soft font-light text-slate-800 mb-3">Meine Protokolle</h1>
                <p className="text-slate-600 text-lg font-soft">
                  Verwalten Sie Ihre Mikrodosierungs-Protokolle und verfolgen Sie den Fortschritt
                </p>
              </div>
              <div className="flex space-x-3">
                <Link to="/dashboard/calendar">
                  <Button 
                    variant="outline"
                    className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Kalender
                  </Button>
                </Link>
                <Link to="/protocols/create">
                  <Button className="rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Neues Protokoll
                  </Button>
                </Link>
              </div>
            </div>

            {/* Protocols Grid */}
            {protocols.length === 0 ? (
              <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-calm-turquoise-100 to-calm-lilac-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-10 h-10 text-calm-turquoise-600" />
                  </div>
                  <h3 className="text-2xl font-soft font-semibold text-slate-800 mb-4">Noch keine Protokolle</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg font-soft">
                    Erstellen Sie Ihr erstes Mikrodosierungs-Protokoll, um strukturiert mit der Praxis zu beginnen.
                  </p>
                  <Link to="/protocols/create">
                    <Button className="rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Plus className="w-5 h-5 mr-2" />
                      Erstes Protokoll erstellen
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protocols.map((protocol: any) => {
                  const progress = calculateProgress(protocol);
                  const canDelete = protocol.status !== 'completed' && protocol.events?.length === 0;
                  
                  return (
                    <div key={protocol.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 hover:shadow-2xl group transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl ${getProtocolColor(protocol.type)} group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                              {getProtocolIcon(protocol.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-soft font-semibold text-slate-800">
                                {protocol.name}
                              </h3>
                              <p className="text-sm text-slate-600 capitalize font-soft">
                                {protocol.type}-Protokoll
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(protocol.status)}
                            <span className="text-sm text-slate-600 font-soft">
                              {getStatusText(protocol.status)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-slate-600 mb-3 font-soft">
                            <span>Fortschritt</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-2xl h-3">
                            <div 
                              className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 h-3 rounded-2xl transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-3 text-sm mb-6">
                          <div className="flex justify-between">
                            <span className="text-slate-gray">Start:</span>
                            <span className="font-medium text-charcoal">{formatDate(protocol.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-gray">Ende:</span>
                            <span className="font-medium text-charcoal">{formatDate(protocol.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-gray">Dauer:</span>
                            <span className="font-medium text-charcoal">{protocol.cycleLength} Wochen</span>
                          </div>
                        </div>

                        {/* Events Count */}
                        <div className="flex justify-between items-center text-sm mb-6">
                          <span className="text-slate-gray">Events:</span>
                          <span className="font-medium text-charcoal">{protocol._count?.events || 0}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <Link to={`/protocols/${protocol.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full btn-secondary"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Anzeigen
                            </Button>
                          </Link>
                          {canDelete && (
                            <Button
                              variant="outline"
                              className="px-4 border-coral/20 hover:border-coral/30 text-coral hover:text-coral"
                              onClick={() => handleDeleteProtocol(protocol.id, protocol.name)}
                              disabled={deleteProtocolMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Stats */}
            {protocols.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-elevated">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-turquoise/10 rounded-medium flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-turquoise" />
                    </div>
                    <div className="text-2xl font-bold text-charcoal mb-1">
                      {protocols.length}
                    </div>
                    <div className="text-sm text-slate-gray">
                      {protocols.length === 1 ? 'Protokoll' : 'Protokolle'}
                    </div>
                  </div>
                </div>

                <div className="card-elevated">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-coral/10 rounded-medium flex items-center justify-center mx-auto mb-4">
                      <Play className="w-6 h-6 text-coral" />
                    </div>
                    <div className="text-2xl font-bold text-charcoal mb-1">
                      {protocols.filter((p: any) => p.status === 'active').length}
                    </div>
                    <div className="text-sm text-slate-gray">Aktive Protokolle</div>
                  </div>
                </div>

                <div className="card-elevated">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-gray/10 rounded-medium flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-slate-gray" />
                    </div>
                    <div className="text-2xl font-bold text-charcoal mb-1">
                      {protocols.filter((p: any) => p.status === 'completed').length}
                    </div>
                    <div className="text-sm text-slate-gray">Abgeschlossen</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}