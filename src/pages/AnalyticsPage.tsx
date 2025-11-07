import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { DashboardTabNavigation } from '@/components/DashboardTabNavigation';
import { AdherenceHeatmap } from '@/components/AdherenceHeatmap';
import { apiClient } from '@/lib/api';
import { 
  BarChart3,
  TrendingUp,
  Target,
  Brain,
  Heart,
  Users,
  Zap,
  Calendar,
  Award,
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dashboard-tabs.css';

export function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState(30);
  const [adherenceTimeRange, setAdherenceTimeRange] = useState(365);
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

  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['journal-analytics', timeRange],
    queryFn: () => apiClient.getJournalAnalytics(timeRange),
    enabled: !!user,
  });

  const { data: adherenceData, isLoading: adherenceLoading, refetch: refetchAdherence } = useQuery({
    queryKey: ['adherence-data', adherenceTimeRange],
    queryFn: () => apiClient.getAdherenceData(adherenceTimeRange),
    enabled: !!user,
  });

  const { data: protocolsData } = useQuery({
    queryKey: ['protocols'],
    queryFn: () => apiClient.getProtocols(),
    enabled: !!user,
  });

  const analytics = analyticsData?.analytics;
  const protocols = protocolsData?.protocols || [];
  const adherence = adherenceData?.adherence;

  const getMetricColor = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'mood': return <Heart className="w-5 h-5" />;
      case 'energy': return <Zap className="w-5 h-5" />;
      case 'focus': return <Brain className="w-5 h-5" />;
      case 'creativity': return <Target className="w-5 h-5" />;
      case 'socialConnection': return <Users className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getIntentionFulfillmentColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading || adherenceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Tab Navigation */}
            <DashboardTabNavigation />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-soft font-light text-slate-800">
                  Fortschritts-
                  <span className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                    analyse
                  </span>
                </h1>
                <p className="text-slate-600 font-soft">
                  Datenbasierte Einblicke in Ihre Mikrodosierungs-Praxis
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  refetch();
                  refetchAdherence();
                }}
                className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </Button>
              <Button className="rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Download className="w-4 h-4 mr-2" />
                Exportieren
              </Button>
            </div>
          </div>

          {/* Adherence Heatmap */}
          <div className="mb-8">
            <AdherenceHeatmap
              data={adherence}
              isLoading={adherenceLoading}
              onTimeRangeChange={setAdherenceTimeRange}
            />
          </div>

          {/* Time Range Filter */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">Zeitraum:</span>
                </div>
                <div className="flex space-x-2">
                  {[7, 30, 90, 365].map((days) => (
                    <Button
                      key={days}
                      variant={timeRange === days ? "default" : "outline"}
                      onClick={() => setTimeRange(days)}
                      className="rounded-xl"
                    >
                      {days === 7 ? '7 Tage' : 
                       days === 30 ? '30 Tage' :
                       days === 90 ? '3 Monate' : '1 Jahr'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-peach-100 to-calm-peach-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <FileText className="w-6 h-6 text-calm-peach-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {analytics?.totalEntries || 0}
                </div>
                <div className="text-sm text-slate-600">Journal-Einträge</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-turquoise-100 to-calm-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Target className="w-6 h-6 text-calm-turquoise-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {analytics?.entriesByType?.intention || 0}
                </div>
                <div className="text-sm text-slate-600">Intentionen</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-lilac-100 to-calm-lilac-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Brain className="w-6 h-6 text-calm-lilac-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {analytics?.entriesByType?.reflection || 0}
                </div>
                <div className="text-sm text-slate-600">Reflexionen</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-yellow-100 to-calm-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BarChart3 className="w-6 h-6 text-calm-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {analytics?.entriesByType?.assessment || 0}
                </div>
                <div className="text-sm text-slate-600">Assessments</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Average Metrics */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Durchschnittliche Metriken
                </CardTitle>
                <CardDescription>
                  Ihre durchschnittlichen Werte der letzten {timeRange} Tage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.averageMetrics && Object.entries(analytics.averageMetrics).map(([metric, value]) => (
                    <div key={metric} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        {getMetricIcon(metric)}
                        <span className="font-medium capitalize">
                          {metric === 'mood' ? 'Stimmung' :
                           metric === 'energy' ? 'Energie' :
                           metric === 'focus' ? 'Fokus' :
                           metric === 'creativity' ? 'Kreativität' :
                           'Soziale Verbundenheit'}
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${getMetricColor(value as number, metric === 'mood' ? 5 : 10)}`}>
                        {typeof value === 'number' ? value.toFixed(1) : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Intention Fulfillment */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Intention-Erfüllung
                </CardTitle>
                <CardDescription>
                  Wie gut wurden Ihre gesetzten Ziele erreicht?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.intentionFulfillment && Object.entries(analytics.intentionFulfillment).map(([category, percentage]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {category === 'creativity' ? 'Kreativität' :
                           category === 'focus' ? 'Fokus' :
                           category === 'wellbeing' ? 'Wohlbefinden' :
                           category === 'social' ? 'Soziabilität' :
                           'Spiritualität'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getIntentionFulfillmentColor(percentage as number)}`}>
                          {typeof percentage === 'number' ? `${percentage.toFixed(0)}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-sage-500 to-sage-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${typeof percentage === 'number' ? percentage : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Performance */}
          <Card className="mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Protokoll-Performance
              </CardTitle>
              <CardDescription>
                Übersicht Ihrer aktiven Protokolle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protocols.map((protocol: any) => {
                  const progress = Math.round(
                    ((new Date().getTime() - new Date(protocol.startDate).getTime()) / 
                     (new Date(protocol.endDate).getTime() - new Date(protocol.startDate).getTime())) * 100
                  );
                  
                  return (
                    <div key={protocol.id} className="p-6 bg-slate-50 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{protocol.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          protocol.status === 'active' ? 'bg-green-100 text-green-700' :
                          protocol.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {protocol.status === 'active' ? 'Aktiv' :
                           protocol.status === 'paused' ? 'Pausiert' : 'Abgeschlossen'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Fortschritt:</span>
                          <span className="font-semibold">{Math.min(progress, 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-sage-500 to-sage-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Typ: {protocol.type}</span>
                          <span>{protocol.cycleLength} Wochen</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Insights and Recommendations */}
          <Card className="mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Erkenntnisse & Empfehlungen
              </CardTitle>
              <CardDescription>
                Algorithmusgestützte Einblicke zur Optimierung Ihrer Praxis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">Konsistenz-Tipp</div>
                      <div className="text-blue-800 text-sm">
                        Ihre Journaling-Konsistenz liegt bei {analytics?.totalEntries ? Math.round((analytics.totalEntries / timeRange) * 100) : 0}%. 
                        Regelmäßige Reflexionen verbessern nachweislich die Wirksamkeit der Mikrodosierung.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-900 mb-1">Positive Entwicklung</div>
                      <div className="text-green-800 text-sm">
                        Ihre durchschnittliche Stimmung zeigt eine positive Tendenz. 
                        Dies deutet auf eine erfolgreiche Anpassung Ihres Protokolls hin.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-900 mb-1">Optimierungsvorschlag</div>
                      <div className="text-amber-800 text-sm">
                        Betrachten Sie eine Anpassung Ihrer Einnahmezeiten. 
                        Die meisten positiven Effekte werden bei morgendlicher Einnahme berichtet.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
