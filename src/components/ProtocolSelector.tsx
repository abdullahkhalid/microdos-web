import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Check, 
  ArrowRight,
  Info,
  AlertCircle,
  Zap,
  Brain,
  Settings
} from 'lucide-react';

interface ProtocolSelectorProps {
  onSuccess: (protocol: any) => void;
  onBack: () => void;
}

type ProtocolType = 'fadiman' | 'stamets' | 'custom';

const PROTOCOL_TYPES = [
  {
    id: 'fadiman' as ProtocolType,
    name: 'Fadiman-Protokoll',
    description: '1 Tag Einnahme, 2 Tage Pause (3-Tages-Zyklus)',
    icon: <Zap className="w-6 h-6" />,
    color: 'blue',
    details: [
      'Bewährtes 3-Tage-Protokoll',
      'Ideal für Einsteiger',
      'Systematische Selbstbeobachtung',
      'Wissenschaftlich validiert'
    ]
  },
  {
    id: 'stamets' as ProtocolType,
    name: 'Stamets Stack',
    description: '4 Tage Einnahme, 3 Tage Pause (wochenbasiert)',
    icon: <Brain className="w-6 h-6" />,
    color: 'green',
    details: [
      'Kognitive Leistungssteigerung',
      'Ergänzbar mit Nootropika',
      'Für Fortgeschrittene',
      'Neuroplastizitäts-fokussiert'
    ]
  },
  {
    id: 'custom' as ProtocolType,
    name: 'Benutzerdefiniertes Protokoll',
    description: 'Individuelle Wochentag-Auswahl',
    icon: <Settings className="w-6 h-6" />,
    color: 'purple',
    details: [
      'Flexible Tagesauswahl',
      'Anpassbar an Lebensrhythmus',
      'Mindestens 3 Pausentage/Woche',
      'Personalisierte Struktur'
    ]
  }
];

const WEEKDAYS = [
  { id: 0, name: 'Sonntag', short: 'So' },
  { id: 1, name: 'Montag', short: 'Mo' },
  { id: 2, name: 'Dienstag', short: 'Di' },
  { id: 3, name: 'Mittwoch', short: 'Mi' },
  { id: 4, name: 'Donnerstag', short: 'Do' },
  { id: 5, name: 'Freitag', short: 'Fr' },
  { id: 6, name: 'Samstag', short: 'Sa' },
];

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  onSuccess,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState<ProtocolType | null>(null);
  const [protocolName, setProtocolName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState(4);
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [morningTime, setMorningTime] = useState('07:00');
  const [eveningTime, setEveningTime] = useState('20:00');
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['email']);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleCustomDayToggle = (dayId: number) => {
    setCustomDays(prev => {
      const newDays = prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId];
      
      // Ensure maximum 4 days per week
      if (newDays.length > 4) {
        toast({
          title: 'Zu viele Einnahmetage',
          description: 'Maximum 4 Einnahmetage pro Woche erlaubt',
          variant: 'destructive',
        });
        return prev;
      }
      
      return newDays;
    });
  };

  const handleNotificationChannelToggle = (channel: string) => {
    setNotificationChannels(prev => 
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const canProceed = () => {
    if (!selectedType || !protocolName || !startDate) return false;
    
    if (selectedType === 'custom' && customDays.length === 0) return false;
    
    return true;
  };

  const handleCreateProtocol = async () => {
    if (!canProceed()) return;

    setCreating(true);
    try {
      const settings: any = {};
      
      if (selectedType === 'custom') {
        settings.custom = {
          doseDays: customDays,
          customName: protocolName,
        };
      } else if (selectedType === 'fadiman') {
        settings.fadiman = {};
      } else if (selectedType === 'stamets') {
        settings.stamets = {
          nootropics: [], // Can be extended later
        };
      }

      const protocolData = {
        type: selectedType!,
        name: protocolName,
        startDate: new Date(startDate).toISOString(),
        cycleLength,
        settings,
        notificationSettings: {
          morningReminder: {
            enabled: true,
            time: morningTime,
          },
          eveningReflection: {
            enabled: true,
            time: eveningTime,
          },
          channels: notificationChannels,
        },
      };

      const response = await apiClient.createProtocol(protocolData);
      
      if (response.success) {
        toast({
          title: 'Protokoll erstellt',
          description: `${protocolName} wurde erfolgreich erstellt`,
        });
        onSuccess(response.protocol);
      }
    } catch (error) {
      console.error('Error creating protocol:', error);
      toast({
        title: 'Fehler beim Erstellen',
        description: 'Das Protokoll konnte nicht erstellt werden',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border-2 transition-all duration-300 hover:scale-[1.02]';
    
    if (!isSelected) {
      return `${baseClasses} border-slate-200 hover:border-slate-300 text-slate-600 hover:shadow-md`;
    }
    
    switch (color) {
      case 'blue':
        return `${baseClasses} border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-200/50`;
      case 'green':
        return `${baseClasses} border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-700 shadow-lg shadow-green-200/50`;
      case 'purple':
        return `${baseClasses} border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 shadow-lg shadow-purple-200/50`;
      default:
        return `${baseClasses} border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-200/50 shadow-sm mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-700 font-semibold text-lg">Protokoll-Auswahl</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Strukturierte Mikrodosierung
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Wählen Sie ein bewährtes Protokoll oder erstellen Sie Ihr individuelles System
            </p>
          </div>

          {/* Protocol Selection */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">Protokoll-Typ wählen</CardTitle>
              <CardDescription className="text-slate-600">
                Wählen Sie das Protokoll, das am besten zu Ihren Zielen passt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {PROTOCOL_TYPES.map((protocol) => {
                  const isSelected = selectedType === protocol.id;
                  return (
                    <button
                      key={protocol.id}
                      onClick={() => setSelectedType(protocol.id)}
                      className={`p-6 rounded-2xl text-left w-full ${getColorClasses(protocol.color, isSelected)}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          isSelected ? 'bg-white/60' : 'bg-slate-100'
                        }`}>
                          {protocol.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-2">{protocol.name}</div>
                          <div className="text-sm opacity-75 mb-3">{protocol.description}</div>
                          <div className="space-y-1">
                            {protocol.details.map((detail, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs">
                                <Check className="w-3 h-3" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-6 h-6 text-sage-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Protocol Configuration */}
          {selectedType && (
            <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">Protokoll konfigurieren</CardTitle>
                <CardDescription className="text-slate-600">
                  Passen Sie Ihr Protokoll an Ihre Bedürfnisse an
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Settings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="protocolName" className="text-slate-800 font-semibold text-lg">Protokoll-Name</Label>
                    <Input
                      id="protocolName"
                      value={protocolName}
                      onChange={(e) => setProtocolName(e.target.value)}
                      placeholder="z.B. Mein Fadiman-Protokoll"
                      className="mt-2 py-3 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate" className="text-slate-800 font-semibold text-lg">Startdatum</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 py-3 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Cycle Length */}
                <div>
                  <Label className="text-slate-800 font-semibold text-lg">Zyklusdauer</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-sage-100"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((cycleLength - 2) / 4) * 100}%, #e2e8f0 ${((cycleLength - 2) / 4) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <div className="text-2xl font-bold text-sage-700 min-w-[60px] text-center">
                      {cycleLength} Wochen
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>2 Wochen</span>
                    <span>6 Wochen</span>
                  </div>
                </div>

                {/* Custom Days Selection */}
                {selectedType === 'custom' && (
                  <div>
                    <Label className="text-slate-800 font-semibold text-lg">Einnahmetage wählen</Label>
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {WEEKDAYS.map((day) => {
                        const isSelected = customDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            onClick={() => handleCustomDayToggle(day.id)}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              isSelected
                                ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-md'
                                : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-sm'
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-semibold text-sm">{day.short}</div>
                              <div className="text-xs opacity-75">{day.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center space-x-2 text-sm text-slate-600">
                      <Info className="w-4 h-4" />
                      <span>Mindestens 3 Pausentage pro Woche erforderlich</span>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-sage-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Benachrichtigungseinstellungen</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="morningTime" className="text-slate-800 font-semibold">Morgens-Erinnerung</Label>
                      <div className="mt-2 flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <Input
                          id="morningTime"
                          type="time"
                          value={morningTime}
                          onChange={(e) => setMorningTime(e.target.value)}
                          className="py-2 rounded-xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="eveningTime" className="text-slate-800 font-semibold">Abend-Reflexion</Label>
                      <div className="mt-2 flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <Input
                          id="eveningTime"
                          type="time"
                          value={eveningTime}
                          onChange={(e) => setEveningTime(e.target.value)}
                          className="py-2 rounded-xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-800 font-semibold">Benachrichtigungskanäle</Label>
                    <div className="mt-2 flex space-x-4">
                      {['email', 'push'].map((channel) => (
                        <button
                          key={channel}
                          onClick={() => handleNotificationChannelToggle(channel)}
                          className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                            notificationChannels.includes(channel)
                              ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700'
                              : 'border-slate-200 hover:border-sage-300 text-slate-600'
                          }`}
                        >
                          {channel === 'email' ? 'E-Mail' : 'Push-Benachrichtigungen'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-2xl border-slate-200/60 hover:border-slate-300 text-slate-600 hover:text-slate-700 bg-white/80 backdrop-blur-sm px-6 py-3 transition-all duration-300 hover:shadow-md"
            >
              Zurück
            </Button>

            <Button
              onClick={handleCreateProtocol}
              disabled={!canProceed() || creating}
              className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                  <span className="font-medium">Erstelle...</span>
                </>
              ) : (
                <>
                  <span className="font-medium">Protokoll erstellen</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
