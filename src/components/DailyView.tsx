import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Pill,
  Target,
  Heart,
  Brain,
  Zap,
  Users,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Timer,
  Check,
  ArrowRight,
  FileText
} from 'lucide-react';
import { JournalingSystem } from './JournalingSystem';

interface DailyEvent {
  id: string;
  date: string;
  type: 'dose' | 'pause';
  status: 'scheduled' | 'completed' | 'missed' | 'skipped';
  substance?: string;
  dose?: number;
  doseUnit?: string;
  protocolName: string;
  protocolType: string;
}

interface DailyViewProps {
  date: Date;
  events: DailyEvent[];
  onEventUpdate?: (eventId: string, updates: Partial<DailyEvent>) => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  date,
  events,
  onEventUpdate,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [focus, setFocus] = useState<number>(5);
  const [creativity, setCreativity] = useState<number>(5);
  const [socialConnection, setSocialConnection] = useState<number>(5);
  const [journalEntry, setJournalEntry] = useState('');
  const [intentions, setIntentions] = useState<string[]>([]);
  const [customIntention, setCustomIntention] = useState('');
  const [isPrepared, setIsPrepared] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [preparationTimer, setPreparationTimer] = useState<number | null>(null);

  const todayEvents = events.filter(event => {
    // Create date objects without time to avoid timezone issues
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === currentDate.getTime();
  });

  const doseEvent = todayEvents.find(event => event.type === 'dose');
  const isDoseDay = !!doseEvent;
  const isPauseDay = todayEvents.some(event => event.type === 'pause');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Preparation timer
  useEffect(() => {
    if (preparationTimer && preparationTimer > 0) {
      const timer = setTimeout(() => {
        setPreparationTimer(preparationTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (preparationTimer === 0) {
      setIsTaken(true);
      if (doseEvent && onEventUpdate) {
        onEventUpdate(doseEvent.id, { status: 'completed' });
      }
    }
  }, [preparationTimer, doseEvent, onEventUpdate]);

  const getNextDoseTime = () => {
    // Find next dose event
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    
    const futureEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return event.type === 'dose' && eventDate > currentDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (futureEvents.length > 0) {
      return new Date(futureEvents[0].date);
    }
    return null;
  };

  const formatTimeUntil = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Jetzt';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getMoodIcon = (moodValue: number) => {
    if (moodValue === 1) return <Frown className="w-6 h-6 text-red-500" />;
    if (moodValue === 2) return <Frown className="w-6 h-6 text-orange-500" />;
    if (moodValue === 3) return <Meh className="w-6 h-6 text-yellow-500" />;
    if (moodValue === 4) return <Smile className="w-6 h-6 text-green-500" />;
    return <Smile className="w-6 h-6 text-green-600" />;
  };

  const getMoodText = (moodValue: number) => {
    if (moodValue === 1) return 'Sehr schlecht';
    if (moodValue === 2) return 'Schlecht';
    if (moodValue === 3) return 'Neutral';
    if (moodValue === 4) return 'Gut';
    return 'Sehr gut';
  };

  const handleIntentionToggle = (intention: string) => {
    setIntentions(prev => 
      prev.includes(intention)
        ? prev.filter(i => i !== intention)
        : [...prev, intention]
    );
  };

  const handlePreparationStart = () => {
    setIsPrepared(true);
    setPreparationTimer(300); // 5 minutes
  };

  const handleDoseTaken = () => {
    setIsTaken(true);
    if (doseEvent && onEventUpdate) {
      onEventUpdate(doseEvent.id, { status: 'completed' });
    }
  };

  const nextDoseTime = getNextDoseTime();

  return (
    <div className="space-y-6">
      {/* Primary Status Card */}
      <Card className={`border-0 shadow-2xl rounded-3xl overflow-hidden ${
        isDoseDay 
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
      }`}>
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${
                isDoseDay ? 'bg-green-200' : 'bg-blue-200'
              }`}>
                {isDoseDay ? (
                  <Pill className="w-8 h-8 text-green-700" />
                ) : (
                  <Pause className="w-8 h-8 text-blue-700" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {isDoseDay ? 'Heute ist ein Mikrodosierungs-Tag' : 'Heute ist ein Pausentag'}
                </h2>
                <p className="text-slate-600">
                  {isDoseDay 
                    ? `Geplante Dosis: ${doseEvent?.dose} ${doseEvent?.doseUnit} ${doseEvent?.substance}`
                    : 'Zeit für Reflexion und Erholung'
                  }
                </p>
              </div>
            </div>
            {nextDoseTime && (
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">Nächste Einnahme in:</div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatTimeUntil(nextDoseTime)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Intentions Workflow - Only on dose days */}
      {isDoseDay && !isTaken && (
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Intentions-Workflow
            </CardTitle>
            <CardDescription>
              Setzen Sie Ihre Absichten für die heutige Praxis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Intention Categories */}
            <div>
              <Label className="text-slate-800 font-semibold text-lg mb-3 block">
                Welche Effekte erhoffen Sie sich?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'creativity', label: 'Kreativität', icon: <Zap className="w-4 h-4" /> },
                  { id: 'focus', label: 'Fokus', icon: <Brain className="w-4 h-4" /> },
                  { id: 'wellbeing', label: 'Wohlbefinden', icon: <Heart className="w-4 h-4" /> },
                  { id: 'social', label: 'Soziabilität', icon: <Users className="w-4 h-4" /> },
                  { id: 'spirituality', label: 'Spiritualität', icon: <Target className="w-4 h-4" /> },
                ].map((intention) => (
                  <button
                    key={intention.id}
                    onClick={() => handleIntentionToggle(intention.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      intentions.includes(intention.id)
                        ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700'
                        : 'border-slate-200 hover:border-sage-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {intention.icon}
                      <span className="text-sm font-medium">{intention.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Intention */}
            <div>
              <Label htmlFor="customIntention" className="text-slate-800 font-semibold">
                Persönliche Ziele (optional)
              </Label>
              <Input
                id="customIntention"
                value={customIntention}
                onChange={(e) => setCustomIntention(e.target.value)}
                placeholder="Beschreiben Sie Ihre persönlichen Ziele..."
                className="mt-2 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
              />
            </div>

            {/* Preparation Steps */}
            {intentions.length > 0 && (
              <div className="space-y-4">
                {!isPrepared && (
                  <Button
                    onClick={handlePreparationStart}
                    className="w-full rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Vorbereitet
                  </Button>
                )}

                {isPrepared && preparationTimer !== null && preparationTimer > 0 && (
                  <div className="text-center p-6 bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl">
                    <Timer className="w-8 h-8 text-sage-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-sage-700 mb-2">
                      {Math.floor(preparationTimer / 60)}:{(preparationTimer % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-slate-600">Nehmen Sie sich Zeit für die Vorbereitung</p>
                  </div>
                )}

                {isPrepared && preparationTimer === 0 && !isTaken && (
                  <Button
                    onClick={handleDoseTaken}
                    className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Pill className="w-5 h-5 mr-2" />
                    Eingenommen
                  </Button>
                )}

                {isTaken && (
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="text-lg font-semibold text-green-700 mb-2">
                      Dosis eingenommen
                    </div>
                    <p className="text-slate-600">
                      Zeitstempel: {currentTime.toLocaleTimeString('de-DE')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily Tracking System - Redesigned */}
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-2xl font-light text-slate-800">Tägliches Tracking</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Erfassen Sie Ihre täglichen Metriken und Erfahrungen
          </p>
        </div>

        {/* Mood Tracker - Emoji Style */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-sm">
          <div className="text-center space-y-6">
            <h3 className="text-lg font-medium text-slate-700 mb-6">Wie fühlen Sie sich heute?</h3>
            
            <div className="flex justify-center space-x-4">
              {[
                { value: 1, emoji: '😢', label: 'Sehr schlecht', color: 'from-wellness-rose-100 to-wellness-rose-200', textColor: 'text-wellness-rose-600' },
                { value: 2, emoji: '😔', label: 'Schlecht', color: 'from-wellness-yellow-100 to-wellness-yellow-200', textColor: 'text-wellness-yellow-600' },
                { value: 3, emoji: '😐', label: 'Neutral', color: 'from-wellness-blue-100 to-wellness-blue-200', textColor: 'text-wellness-blue-600' },
                { value: 4, emoji: '😊', label: 'Gut', color: 'from-wellness-mint-100 to-wellness-mint-200', textColor: 'text-wellness-mint-600' },
                { value: 5, emoji: '😄', label: 'Sehr gut', color: 'from-wellness-lavender-100 to-wellness-lavender-200', textColor: 'text-wellness-lavender-600' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setMood(item.value)}
                  className={`group relative flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-300 ${
                    mood === item.value
                      ? `bg-gradient-to-br ${item.color} shadow-lg scale-105`
                      : 'hover:bg-white/50 hover:scale-102'
                  }`}
                >
                  <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                    {item.emoji}
                  </div>
                  <span className={`text-xs font-medium ${mood === item.value ? item.textColor : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  {mood === item.value && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-current"></div>
                  )}
                </button>
              ))}
            </div>
            
            {mood && (
              <div className="mt-4 p-3 bg-white/40 rounded-xl">
                <p className="text-sm text-slate-600">
                  Ausgewählt: <span className="font-medium">{getMoodText(mood)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mood Spectrum - Vertical Layout */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-sm">
          <h3 className="text-lg font-medium text-slate-700 mb-8 text-center">Ihr persönliches Spektrum</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { key: 'energy', label: 'Energie', icon: '⚡', color: 'from-wellness-yellow-400 to-wellness-yellow-500' },
              { key: 'focus', label: 'Fokus', icon: '🎯', color: 'from-wellness-blue-400 to-wellness-blue-500' },
              { key: 'creativity', label: 'Kreativität', icon: '🎨', color: 'from-wellness-lavender-400 to-wellness-lavender-500' },
              { key: 'socialConnection', label: 'Soziale Verbundenheit', icon: '🤝', color: 'from-wellness-mint-400 to-wellness-mint-500' },
            ].map((metric) => {
              const currentValue = metric.key === 'energy' ? energy : 
                                 metric.key === 'focus' ? focus :
                                 metric.key === 'creativity' ? creativity : socialConnection;
              const setValue = metric.key === 'energy' ? setEnergy : 
                             metric.key === 'focus' ? setFocus :
                             metric.key === 'creativity' ? setCreativity : setSocialConnection;
              
              return (
                <div key={metric.key} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{metric.icon}</div>
                    <div>
                      <h4 className="font-medium text-slate-700">{metric.label}</h4>
                      <p className="text-sm text-slate-500">{currentValue}/10</p>
                    </div>
                  </div>
                  
                  {/* Vertical Spectrum */}
                  <div className="relative h-32 bg-gradient-to-t from-wellness-rose-100 via-wellness-yellow-100 to-wellness-mint-100 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-t from-wellness-rose-200/30 via-wellness-yellow-200/30 to-wellness-mint-200/30 rounded-2xl"></div>
                    
                    {/* Value Indicator */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-300 shadow-lg flex items-center justify-center transition-all duration-300"
                      style={{ bottom: `${((currentValue - 1) / 9) * 100}%` }}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${metric.color}`}></div>
                    </div>
                    
                    {/* Scale Labels */}
                    <div className="relative z-10 flex justify-between text-xs text-slate-600">
                      <span>10</span>
                      <span>5</span>
                      <span>1</span>
                    </div>
                  </div>
                  
                  {/* Slider */}
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={currentValue}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-wellness-rose-200 via-wellness-yellow-200 to-wellness-mint-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                    style={{
                      background: `linear-gradient(to right, #fecaca 0%, #fecaca ${((currentValue - 1) / 9) * 40}%, #fef3c7 ${((currentValue - 1) / 9) * 40}%, #fef3c7 ${((currentValue - 1) / 9) * 70}%, #a7f3d0 ${((currentValue - 1) / 9) * 70}%, #a7f3d0 100%)`
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Journal Entry */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 text-center">Tagebuch-Eintrag</h3>
            <div className="relative">
              <textarea
                id="journalEntry"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Beschreiben Sie Ihre Erfahrungen und Beobachtungen..."
                maxLength={500}
                className="w-full p-6 rounded-2xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-wellness-rose-300 focus:ring-4 focus:ring-wellness-rose-100 transition-all duration-300 resize-none text-slate-700 placeholder-slate-400"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white/60 px-2 py-1 rounded-full">
                {journalEntry.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <Button className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-wellness-rose-400 to-wellness-lavender-400 hover:from-wellness-rose-500 hover:to-wellness-lavender-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Check className="w-5 h-5 mr-2" />
            Eintrag speichern
          </Button>
        </div>
      </div>

      {/* Journaling System */}
      {todayEvents.length > 0 && (
        <JournalingSystem
          eventId={todayEvents[0].id}
          eventType={todayEvents[0].type}
          onEntrySaved={(entry) => {
            console.log('Journal entry saved:', entry);
            // TODO: Update UI or show success message
          }}
        />
      )}
    </div>
  );
};
