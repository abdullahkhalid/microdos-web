import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { 
  Target,
  Brain,
  Heart,
  Users,
  Zap,
  Check,
  Star,
  StarOff,
  Mic,
  Camera,
  FileText,
  Save,
  Edit,
  Trash2,
  AlertCircle,
  Info,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface JournalingSystemProps {
  eventId: string;
  eventType: 'dose' | 'pause';
  onEntrySaved?: (entry: any) => void;
}

interface IntentionEntry {
  categories: string[];
  customIntention: string;
  weights: Record<string, number>;
}

interface ReflectionEntry {
  effectiveness: Record<string, number>;
  domains: {
    cognition?: {
      attention?: number;
      memory?: number;
      problemSolving?: number;
    };
    emotion?: {
      mood?: number;
      resilience?: number;
      emotionalRegulation?: number;
    };
    creativity?: {
      divergentThinking?: number;
      inspiration?: number;
      artisticExpression?: number;
    };
    sociability?: {
      empathy?: number;
      communication?: number;
      connectedness?: number;
    };
  };
  journalText: string;
  tags: string[];
}

interface AssessmentEntry {
  mood: number;
  energy: number;
  focus: number;
  creativity: number;
  socialConnection: number;
  journalText: string;
  phq8?: number[];
  gad7?: number[];
  panas?: {
    positive: number[];
    negative: number[];
  };
}

const INTENTION_CATEGORIES = [
  { id: 'creativity', label: 'Kreativität', icon: <Zap className="w-4 h-4" />, description: 'Verbesserte künstlerische und innovative Fähigkeiten' },
  { id: 'focus', label: 'Fokus', icon: <Brain className="w-4 h-4" />, description: 'Erhöhte Konzentration und Aufmerksamkeit' },
  { id: 'wellbeing', label: 'Wohlbefinden', icon: <Heart className="w-4 h-4" />, description: 'Verbesserte Stimmungsstabilität und emotionale Regulation' },
  { id: 'social', label: 'Soziabilität', icon: <Users className="w-4 h-4" />, description: 'Tiefere zwischenmenschliche Beziehungen' },
  { id: 'spirituality', label: 'Spiritualität', icon: <Target className="w-4 h-4" />, description: 'Erweiterte spirituelle Erfahrungen' },
];

const DOMAIN_QUESTIONS = {
  cognition: {
    attention: 'Wie war Ihre Aufmerksamkeit und Konzentration?',
    memory: 'Wie gut war Ihr Gedächtnis und Erinnerungsvermögen?',
    problemSolving: 'Wie effektiv war Ihr Problemlösungsvermögen?',
  },
  emotion: {
    mood: 'Wie war Ihre allgemeine Stimmung?',
    resilience: 'Wie gut konnten Sie mit Stress umgehen?',
    emotionalRegulation: 'Wie gut konnten Sie Ihre Emotionen regulieren?',
  },
  creativity: {
    divergentThinking: 'Wie kreativ und innovativ waren Ihre Gedanken?',
    inspiration: 'Wie inspiriert und motiviert fühlten Sie sich?',
    artisticExpression: 'Wie gut konnten Sie sich künstlerisch ausdrücken?',
  },
  sociability: {
    empathy: 'Wie empathisch und einfühlsam waren Sie?',
    communication: 'Wie gut war Ihre Kommunikation mit anderen?',
    connectedness: 'Wie verbunden fühlten Sie sich mit anderen?',
  },
};

const PHQ8_QUESTIONS = [
  'Haben Sie wenig Interesse oder Freude an Ihren Aktivitäten?',
  'Fühlten Sie sich niedergeschlagen, depressiv oder hoffnungslos?',
  'Hatten Sie Probleme beim Einschlafen, Durchschlafen oder schliefen Sie zu viel?',
  'Fühlten Sie sich müde oder hatten wenig Energie?',
  'Hatten Sie einen schlechten Appetit oder aßen Sie zu viel?',
  'Fühlten Sie sich schlecht über sich selbst - oder hatten das Gefühl, ein Versager zu sein?',
  'Hatten Sie Konzentrationsprobleme, z.B. beim Lesen oder Fernsehen?',
  'Bewegten Sie sich oder sprachen Sie so langsam, dass andere es bemerken könnten?',
];

const GAD7_QUESTIONS = [
  'Fühlten Sie sich nervös, ängstlich oder aufgeregt?',
  'Konnten Sie Sorgen nicht stoppen oder kontrollieren?',
  'Sorgten Sie sich zu sehr um verschiedene Dinge?',
  'Fiel es Ihnen schwer, sich zu entspannen?',
  'Waren Sie so unruhig, dass es schwer war, still zu sitzen?',
  'Wurden Sie leicht verärgert oder reizbar?',
  'Hatten Sie Angst, dass etwas Schlimmes passieren könnte?',
];

const PANAS_POSITIVE = [
  'Interessiert', 'Aufgeregt', 'Stark', 'Begeistert', 'Stolz',
  'Wachsam', 'Inspiriert', 'Entschlossen', 'Aufmerksam', 'Aktiv'
];

const PANAS_NEGATIVE = [
  'Verärgert', 'Beschämt', 'Schuldig', 'Feindselig', 'Gereizt',
  'Beschämt', 'Nervös', 'Ängstlich', 'Verängstigt', 'Verärgert'
];

export const JournalingSystem: React.FC<JournalingSystemProps> = ({
  eventId,
  eventType,
  onEntrySaved,
}) => {
  const [activeTab, setActiveTab] = useState<'intention' | 'reflection' | 'assessment'>('intention');
  const [loading, setLoading] = useState(false);
  const [existingEntries, setExistingEntries] = useState<any[]>([]);
  const { toast } = useToast();

  // Intention state
  const [intentionData, setIntentionData] = useState<IntentionEntry>({
    categories: [],
    customIntention: '',
    weights: {},
  });

  // Reflection state
  const [reflectionData, setReflectionData] = useState<ReflectionEntry>({
    effectiveness: {},
    domains: {},
    journalText: '',
    tags: [],
  });

  // Assessment state
  const [assessmentData, setAssessmentData] = useState<AssessmentEntry>({
    mood: 3,
    energy: 5,
    focus: 5,
    creativity: 5,
    socialConnection: 5,
    journalText: '',
  });

  // Clinical assessments
  const [showClinicalAssessments, setShowClinicalAssessments] = useState(false);
  const [phq8Responses, setPhq8Responses] = useState<number[]>(new Array(8).fill(0));
  const [gad7Responses, setGad7Responses] = useState<number[]>(new Array(7).fill(0));
  const [panasResponses, setPanasResponses] = useState({
    positive: new Array(10).fill(1),
    negative: new Array(10).fill(1),
  });

  useEffect(() => {
    loadExistingEntries();
  }, [eventId]);

  const loadExistingEntries = async () => {
    try {
      const response = await apiClient.getJournalEntries(eventId);
      if (response.success) {
        setExistingEntries(response.entries);
        
        // Load existing data into forms
        response.entries.forEach(entry => {
          if (entry.type === 'intention') {
            setIntentionData(entry.content);
          } else if (entry.type === 'reflection') {
            setReflectionData(entry.content);
          } else if (entry.type === 'assessment') {
            setAssessmentData(entry.content);
          }
        });
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleIntentionCategoryToggle = (categoryId: string) => {
    setIntentionData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleIntentionWeightChange = (categoryId: string, weight: number) => {
    setIntentionData(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [categoryId]: weight,
      },
    }));
  };

  const handleReflectionEffectivenessChange = (categoryId: string, percentage: number) => {
    setReflectionData(prev => ({
      ...prev,
      effectiveness: {
        ...prev.effectiveness,
        [categoryId]: percentage,
      },
    }));
  };

  const handleDomainRatingChange = (domain: string, subdomain: string, rating: number) => {
    setReflectionData(prev => ({
      ...prev,
      domains: {
        ...prev.domains,
        [domain]: {
          ...prev.domains[domain as keyof typeof prev.domains],
          [subdomain]: rating,
        },
      },
    }));
  };

  const saveEntry = async (type: 'intention' | 'reflection' | 'assessment') => {
    if (loading) return;

    setLoading(true);
    try {
      let content: any = {};

      if (type === 'intention') {
        if (intentionData.categories.length === 0) {
          toast({
            title: 'Kategorie erforderlich',
            description: 'Bitte wählen Sie mindestens eine Kategorie aus',
            variant: 'destructive',
          });
          return;
        }
        content = intentionData;
      } else if (type === 'reflection') {
        content = reflectionData;
      } else if (type === 'assessment') {
        content = {
          ...assessmentData,
          phq8: showClinicalAssessments ? phq8Responses : undefined,
          gad7: showClinicalAssessments ? gad7Responses : undefined,
          panas: showClinicalAssessments ? panasResponses : undefined,
        };
      }

      const response = await apiClient.createJournalEntry({
        eventId,
        type,
        content,
      });

      if (response.success) {
        toast({
          title: 'Eintrag gespeichert',
          description: `${type === 'intention' ? 'Intention' : type === 'reflection' ? 'Reflexion' : 'Assessment'} erfolgreich gespeichert`,
        });
        
        setExistingEntries(prev => [...prev, response.journalEntry]);
        onEntrySaved?.(response.journalEntry);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: 'Fehler beim Speichern',
        description: 'Der Eintrag konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderIntentionForm = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-slate-800 font-semibold text-lg mb-3 block">
          Welche spezifischen Effekte oder Erfahrungen erhoffen Sie sich von Ihrer heutigen Praxis?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTENTION_CATEGORIES.map((category) => {
            const isSelected = intentionData.categories.includes(category.id);
            const weight = intentionData.weights[category.id] || 3;
            
            return (
              <div key={category.id} className="space-y-3">
                <button
                  onClick={() => handleIntentionCategoryToggle(category.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700'
                      : 'border-slate-200 hover:border-sage-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <div>
                      <div className="font-semibold">{category.label}</div>
                      <div className="text-sm opacity-75">{category.description}</div>
                    </div>
                  </div>
                </button>
                
                {isSelected && (
                  <div className="pl-4">
                    <Label className="text-sm text-slate-600 mb-2 block">
                      Wichtigkeit: {weight}/5
                    </Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleIntentionWeightChange(category.id, star)}
                          className="p-1"
                        >
                          {star <= weight ? (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="customIntention" className="text-slate-800 font-semibold mb-2 block">
          Persönliche Ziele (optional)
        </Label>
        <textarea
          id="customIntention"
          value={intentionData.customIntention}
          onChange={(e) => setIntentionData(prev => ({ ...prev, customIntention: e.target.value }))}
          placeholder="Beschreiben Sie Ihre persönlichen Ziele und Erwartungen..."
          maxLength={1000}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300 resize-none"
          rows={4}
        />
        <div className="text-right text-sm text-slate-500 mt-1">
          {intentionData.customIntention.length}/1000
        </div>
      </div>

      <Button
        onClick={() => saveEntry('intention')}
        disabled={loading || intentionData.categories.length === 0}
        className="w-full rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="w-5 h-5 mr-2" />
        Intention speichern
      </Button>
    </div>
  );

  const renderReflectionForm = () => (
    <div className="space-y-6">
      {/* Effectiveness Ratings */}
      {intentionData.categories.length > 0 && (
        <div>
          <Label className="text-slate-800 font-semibold text-lg mb-3 block">
            Wie gut wurden Ihre Intentionen erfüllt?
          </Label>
          <div className="space-y-4">
            {intentionData.categories.map((categoryId) => {
              const category = INTENTION_CATEGORIES.find(c => c.id === categoryId);
              const effectiveness = reflectionData.effectiveness[categoryId] || 0;
              
              return (
                <div key={categoryId} className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-3">
                    {category?.icon}
                    <div>
                      <div className="font-semibold">{category?.label}</div>
                      <div className="text-sm text-slate-600">Erfüllungsgrad: {effectiveness}%</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={effectiveness}
                    onChange={(e) => handleReflectionEffectivenessChange(categoryId, parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-sage-100"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${effectiveness * 0.3}%, #f59e0b ${effectiveness * 0.3}%, #f59e0b ${effectiveness * 0.7}%, #10b981 ${effectiveness * 0.7}%, #10b981 100%)`
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Domain Ratings */}
      <div>
        <Label className="text-slate-800 font-semibold text-lg mb-3 block">
          Detaillierte Bewertung nach Bereichen
        </Label>
        <div className="space-y-6">
          {Object.entries(DOMAIN_QUESTIONS).map(([domain, questions]) => (
            <div key={domain} className="p-4 bg-slate-50 rounded-2xl">
              <h4 className="font-semibold text-slate-900 mb-4 capitalize">{domain}</h4>
              <div className="space-y-4">
                {Object.entries(questions).map(([subdomain, question]) => {
                  const rating = reflectionData.domains[domain as keyof typeof reflectionData.domains]?.[subdomain] || 4;
                  
                  return (
                    <div key={subdomain}>
                      <Label className="text-sm text-slate-700 mb-2 block">{question}</Label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-600 min-w-[60px]">1</span>
                        <input
                          type="range"
                          min="1"
                          max="7"
                          value={rating}
                          onChange={(e) => handleDomainRatingChange(domain, subdomain, parseInt(e.target.value))}
                          className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-sage-100"
                        />
                        <span className="text-sm text-slate-600 min-w-[60px]">7</span>
                        <span className="text-sm font-semibold text-slate-900 min-w-[20px]">{rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journal Text */}
      <div>
        <Label htmlFor="reflectionJournal" className="text-slate-800 font-semibold mb-2 block">
          Persönliche Reflexion
        </Label>
        <textarea
          id="reflectionJournal"
          value={reflectionData.journalText}
          onChange={(e) => setReflectionData(prev => ({ ...prev, journalText: e.target.value }))}
          placeholder="Beschreiben Sie Ihre Erfahrungen, Erkenntnisse und Beobachtungen..."
          maxLength={2000}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300 resize-none"
          rows={6}
        />
        <div className="text-right text-sm text-slate-500 mt-1">
          {reflectionData.journalText.length}/2000
        </div>
      </div>

      <Button
        onClick={() => saveEntry('reflection')}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="w-5 h-5 mr-2" />
        Reflexion speichern
      </Button>
    </div>
  );

  const renderAssessmentForm = () => (
    <div className="space-y-6">
      {/* Core Metrics */}
      <div>
        <Label className="text-slate-800 font-semibold text-lg mb-3 block">
          Tägliche Metriken
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'mood', label: 'Stimmung', max: 5 },
            { key: 'energy', label: 'Energie', max: 10 },
            { key: 'focus', label: 'Fokus', max: 10 },
            { key: 'creativity', label: 'Kreativität', max: 10 },
            { key: 'socialConnection', label: 'Soziale Verbundenheit', max: 10 },
          ].map((metric) => {
            const value = assessmentData[metric.key as keyof AssessmentEntry] as number;
            
            return (
              <div key={metric.key}>
                <Label className="text-slate-800 font-semibold mb-2 block">
                  {metric.label}: {value}/{metric.max}
                </Label>
                <input
                  type="range"
                  min="1"
                  max={metric.max}
                  step={metric.max === 5 ? "1" : "0.5"}
                  value={value}
                  onChange={(e) => setAssessmentData(prev => ({
                    ...prev,
                    [metric.key]: parseFloat(e.target.value),
                  }))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-sage-100"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((value - 1) / (metric.max - 1)) * 33.33}%, #f59e0b ${((value - 1) / (metric.max - 1)) * 33.33}%, #f59e0b ${((value - 1) / (metric.max - 1)) * 66.66}%, #10b981 ${((value - 1) / (metric.max - 1)) * 66.66}%, #10b981 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>{metric.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journal Text */}
      <div>
        <Label htmlFor="assessmentJournal" className="text-slate-800 font-semibold mb-2 block">
          Tägliche Notizen
        </Label>
        <textarea
          id="assessmentJournal"
          value={assessmentData.journalText}
          onChange={(e) => setAssessmentData(prev => ({ ...prev, journalText: e.target.value }))}
          placeholder="Notieren Sie wichtige Beobachtungen, Effekte oder Nebenwirkungen..."
          maxLength={500}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300 resize-none"
          rows={4}
        />
        <div className="text-right text-sm text-slate-500 mt-1">
          {assessmentData.journalText.length}/500
        </div>
      </div>

      {/* Clinical Assessments */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-slate-800 font-semibold text-lg">
            Klinische Assessments (optional)
          </Label>
          <Button
            variant="outline"
            onClick={() => setShowClinicalAssessments(!showClinicalAssessments)}
            className="rounded-xl"
          >
            {showClinicalAssessments ? 'Ausblenden' : 'Anzeigen'}
          </Button>
        </div>
        
        {showClinicalAssessments && (
          <div className="space-y-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <div className="font-semibold mb-1">Datenschutzhinweis</div>
                <div>
                  Diese Assessments werden für Ihre persönliche Analyse verwendet und nicht an Dritte weitergegeben. 
                  Sie können jederzeit deaktiviert werden.
                </div>
              </div>
            </div>

            {/* PHQ-8 */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">PHQ-8 Depressionsskala</h4>
              <div className="space-y-3">
                {PHQ8_QUESTIONS.map((question, index) => (
                  <div key={index}>
                    <Label className="text-sm text-slate-700 mb-2 block">{question}</Label>
                    <div className="flex space-x-4">
                      {[0, 1, 2, 3].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`phq8-${index}`}
                            value={value}
                            checked={phq8Responses[index] === value}
                            onChange={() => {
                              const newResponses = [...phq8Responses];
                              newResponses[index] = value;
                              setPhq8Responses(newResponses);
                            }}
                            className="text-sage-600 focus:ring-sage-500"
                          />
                          <span className="text-sm text-slate-600">
                            {value === 0 ? 'Überhaupt nicht' : 
                             value === 1 ? 'An einzelnen Tagen' :
                             value === 2 ? 'An mehr als der Hälfte der Tage' :
                             'Beinahe jeden Tag'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GAD-7 */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">GAD-7 Angstsakala</h4>
              <div className="space-y-3">
                {GAD7_QUESTIONS.map((question, index) => (
                  <div key={index}>
                    <Label className="text-sm text-slate-700 mb-2 block">{question}</Label>
                    <div className="flex space-x-4">
                      {[0, 1, 2, 3].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`gad7-${index}`}
                            value={value}
                            checked={gad7Responses[index] === value}
                            onChange={() => {
                              const newResponses = [...gad7Responses];
                              newResponses[index] = value;
                              setGad7Responses(newResponses);
                            }}
                            className="text-sage-600 focus:ring-sage-500"
                          />
                          <span className="text-sm text-slate-600">
                            {value === 0 ? 'Überhaupt nicht' : 
                             value === 1 ? 'An einzelnen Tagen' :
                             value === 2 ? 'An mehr als der Hälfte der Tage' :
                             'Beinahe jeden Tag'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={() => saveEntry('assessment')}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="w-5 h-5 mr-2" />
        Assessment speichern
      </Button>
    </div>
  );

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Journaling-System
        </CardTitle>
        <CardDescription>
          Strukturierte Selbstbeobachtung und Reflexion
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'intention', label: 'Intention', icon: <Target className="w-4 h-4" /> },
            { id: 'reflection', label: 'Reflexion', icon: <Brain className="w-4 h-4" /> },
            { id: 'assessment', label: 'Assessment', icon: <BarChart3 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-sage-100 text-sage-700 border-2 border-sage-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        {activeTab === 'intention' && renderIntentionForm()}
        {activeTab === 'reflection' && renderReflectionForm()}
        {activeTab === 'assessment' && renderAssessmentForm()}

        {/* Existing Entries */}
        {existingEntries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">Gespeicherte Einträge</h4>
            <div className="space-y-3">
              {existingEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {entry.type === 'intention' && <Target className="w-4 h-4 text-blue-600" />}
                    {entry.type === 'reflection' && <Brain className="w-4 h-4 text-green-600" />}
                    {entry.type === 'assessment' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                    <div>
                      <div className="font-medium capitalize">{entry.type}</div>
                      <div className="text-sm text-slate-600">
                        {new Date(entry.createdAt).toLocaleString('de-DE')}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
