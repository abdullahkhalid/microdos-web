import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Pause,
  Play,
  Trash2,
  Download,
  Info,
  Zap,
  Brain,
  Settings,
  Bell,
  AlertTriangle
} from 'lucide-react';

export function ProtocolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: protocolData, isLoading } = useQuery({
    queryKey: ['protocol', id],
    queryFn: () => apiClient.getProtocol(id!),
    enabled: !!id,
  });

  const deleteProtocolMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteProtocol(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: 'Protokoll gelöscht',
        description: response.message || 'Das Protokoll wurde erfolgreich gelöscht.',
      });
      navigate('/protocols');
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.response?.data?.message || 'Das Protokoll konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteProtocol = () => {
    if (protocolData?.protocol) {
      const protocolName = protocolData.protocol.name;
      if (window.confirm(`Möchten Sie das Protokoll "${protocolName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
        deleteProtocolMutation.mutate(id!);
      }
    }
  };

  const getProtocolIcon = (type: string) => {
    switch (type) {
      case 'fadiman':
        return <Zap className="w-6 h-6" />;
      case 'stamets':
        return <Brain className="w-6 h-6" />;
      case 'custom':
        return <Settings className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
    }
  };

  const getProtocolColor = (type: string) => {
    switch (type) {
      case 'fadiman':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'stamets':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'custom':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-5 h-5 text-green-600" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
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

  const getEventTypeStats = (events: any[]) => {
    const stats = {
      dose: 0,
      pause: 0,
      completed: 0,
      missed: 0,
    };

    events.forEach(event => {
      if (event.type === 'dose') stats.dose++;
      if (event.type === 'pause') stats.pause++;
      if (event.status === 'completed') stats.completed++;
      if (event.status === 'missed') stats.missed++;
    });

    return stats;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!protocolData?.protocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Protokoll nicht gefunden</h3>
              <p className="text-slate-600 mb-6">
                Das angeforderte Protokoll konnte nicht gefunden werden.
              </p>
              <Button onClick={() => navigate('/protocols')}>
                Zurück zu Protokollen
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const protocol = protocolData.protocol;
  const progress = calculateProgress(protocol);
  const eventStats = getEventTypeStats(protocol.events || []);
  const canDelete = protocol.status !== 'completed' && eventStats.completed === 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/protocols')}
                className="rounded-xl border-slate-200 hover:border-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{protocol.name}</h1>
                <p className="text-slate-600 capitalize">{protocol.type}-Protokoll</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(protocol.status)}
              <span className="text-sm font-medium text-slate-700">
                {getStatusText(protocol.status)}
              </span>
            </div>
          </div>

          {/* Protocol Header Card */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${getProtocolColor(protocol.type)}`}>
                    {getProtocolIcon(protocol.type)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                      {protocol.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Protokoll-ID: {protocol.id}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <span>Erstellt: {formatDate(protocol.createdAt)}</span>
                      <span>•</span>
                      <span>Zuletzt aktualisiert: {formatDate(protocol.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sage-700 mb-1">
                    {progress}%
                  </div>
                  <div className="text-sm text-slate-600">Fortschritt</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-sage-500 to-sage-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Cycle Overview */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Zyklusübersicht
              </CardTitle>
              <CardDescription>
                Zeitraum und Fortschritt Ihres Protokolls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Startdatum:</span>
                    <span className="font-semibold">{formatDate(protocol.startDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Enddatum:</span>
                    <span className="font-semibold">{formatDate(protocol.endDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Zyklusdauer:</span>
                    <span className="font-semibold">{protocol.cycleLength} Wochen</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Geplante Einnahmetage:</span>
                    <span className="font-semibold text-green-600">{eventStats.dose}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Pausentage:</span>
                    <span className="font-semibold text-blue-600">{eventStats.pause}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Abgeschlossen:</span>
                    <span className="font-semibold text-sage-600">{eventStats.completed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Substance and Dosage Information */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Substanz- und Dosierungsinformationen
              </CardTitle>
              <CardDescription>
                Details aus Ihrem Mikrodosierungsberechner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl">
                  <div className="text-3xl font-bold text-sage-700 mb-2">
                    {protocol.events?.[0]?.dose || 'N/A'} {protocol.events?.[0]?.doseUnit || ''}
                  </div>
                  <div className="text-sm text-slate-600">Empfohlene Dosis</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-700 mb-2 capitalize">
                    {protocol.events?.[0]?.substance || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">Substanz</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-700 mb-2">
                    {protocol.type === 'fadiman' ? '1:2' : protocol.type === 'stamets' ? '4:3' : 'Custom'}
                  </div>
                  <div className="text-sm text-slate-600">Protokoll-Rhythmus</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Benachrichtigungspräferenzen
              </CardTitle>
              <CardDescription>
                Ihre konfigurierten Erinnerungszeiten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-sage-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Morgens-Erinnerung</div>
                      <div className="text-sm text-slate-600">
                        {protocol.notificationSettings?.morningReminder?.enabled 
                          ? `Täglich um ${formatTime(protocol.notificationSettings.morningReminder.time)}`
                          : 'Deaktiviert'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-sage-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Abend-Reflexion</div>
                      <div className="text-sm text-slate-600">
                        {protocol.notificationSettings?.eveningReflection?.enabled 
                          ? `Täglich um ${formatTime(protocol.notificationSettings.eveningReflection.time)}`
                          : 'Deaktiviert'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-slate-900 mb-2">Benachrichtigungskanäle</div>
                    <div className="flex space-x-2">
                      {protocol.notificationSettings?.channels?.map((channel: string) => (
                        <span
                          key={channel}
                          className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                        >
                          {channel === 'email' ? 'E-Mail' : 'Push'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Actions */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Protokoll-Aktionen</CardTitle>
              <CardDescription>
                Verwalten Sie Ihr Protokoll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Protokoll exportieren
                </Button>
                {canDelete && (
                  <Button
                    variant="outline"
                    className="rounded-xl border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
                    onClick={handleDeleteProtocol}
                    disabled={deleteProtocolMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteProtocolMutation.isPending ? 'Lösche...' : 'Protokoll löschen'}
                  </Button>
                )}
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <div className="font-semibold mb-1">Hinweis zur Bearbeitung</div>
                    <div>
                      Protokolle können nicht bearbeitet werden, sobald sie erstellt wurden. 
                      Für Änderungen erstellen Sie bitte ein neues Protokoll.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
