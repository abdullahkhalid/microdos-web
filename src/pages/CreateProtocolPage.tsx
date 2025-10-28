import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Zap, 
  Brain, 
  Settings, 
  Calendar,
  Clock,
  Bell,
  CheckCircle
} from 'lucide-react';

export function CreateProtocolPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    startDate: '',
    cycleLength: 4,
    customDays: [] as number[], // Wochentage für benutzerdefinierte Protokolle
    morningReminder: {
      enabled: true,
      time: '09:00'
    },
    eveningReflection: {
      enabled: true,
      time: '20:00'
    },
    channels: ['email'] as string[]
  });

  const protocolTypes = [
    {
      id: 'fadiman',
      name: 'Fadiman Protokoll',
      description: '1 Tag Einnahme, 2 Tage Pause (3-Tage-Zyklus)',
      icon: Zap,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      details: 'Das klassische Fadiman-Protokoll mit einem Einnahmetag gefolgt von zwei Pausentagen. Ideal für Anfänger.'
    },
    {
      id: 'stamets',
      name: 'Stamets Protokoll',
      description: '4 Tage Einnahme, 3 Tage Pause (7-Tage-Zyklus)',
      icon: Brain,
      color: 'bg-green-100 text-green-600 border-green-200',
      details: 'Das Stamets-Protokoll mit vier aufeinanderfolgenden Einnahmetagen gefolgt von drei Pausentagen.'
    },
    {
      id: 'custom',
      name: 'Benutzerdefiniert',
      description: 'Individuelle Einnahmetage pro Woche',
      icon: Settings,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      details: 'Erstellen Sie Ihr eigenes Protokoll mit benutzerdefinierten Einnahmetagen (max. 4 Tage pro Woche).'
    }
  ];

  const weekdays = [
    { id: 0, name: 'Sonntag', short: 'So' },
    { id: 1, name: 'Montag', short: 'Mo' },
    { id: 2, name: 'Dienstag', short: 'Di' },
    { id: 3, name: 'Mittwoch', short: 'Mi' },
    { id: 4, name: 'Donnerstag', short: 'Do' },
    { id: 5, name: 'Freitag', short: 'Fr' },
    { id: 6, name: 'Samstag', short: 'Sa' },
  ];

  const createProtocolMutation = useMutation({
    mutationFn: (data: any) => apiClient.createProtocol(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: 'Protokoll erstellt!',
        description: `${formData.name} wurde erfolgreich erstellt.`,
      });
      navigate('/protocols');
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Erstellen',
        description: error.response?.data?.message || 'Ein Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleCustomDayToggle = (dayId: number) => {
    setFormData(prev => {
      const newDays = prev.customDays.includes(dayId) 
        ? prev.customDays.filter(d => d !== dayId)
        : [...prev.customDays, dayId];
      
      // Ensure maximum 4 days per week
      if (newDays.length > 4) {
        toast({
          title: 'Zu viele Einnahmetage',
          description: 'Maximum 4 Einnahmetage pro Woche erlaubt',
          variant: 'destructive',
        });
        return prev;
      }
      
      return { ...prev, customDays: newDays };
    });
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.name || !formData.startDate) {
      toast({
        title: 'Fehlende Informationen',
        description: 'Bitte füllen Sie alle erforderlichen Felder aus.',
        variant: 'destructive',
      });
      return;
    }

    // Validate custom protocol has at least one day selected
    if (formData.type === 'custom' && formData.customDays.length === 0) {
      toast({
        title: 'Wochentage auswählen',
        description: 'Bitte wählen Sie mindestens einen Wochentag für Ihr benutzerdefiniertes Protokoll aus.',
        variant: 'destructive',
      });
      return;
    }

    const protocolData = {
      type: formData.type,
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      cycleLength: formData.cycleLength,
      settings: {
        [formData.type]: formData.type === 'custom' ? {
          doseDays: formData.customDays,
          customName: formData.name
        } : {}
      },
      notificationSettings: {
        morningReminder: formData.morningReminder,
        eveningReflection: formData.eveningReflection,
        channels: formData.channels
      }
    };

    createProtocolMutation.mutate(protocolData);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/protocols')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Neues Protokoll erstellen</h1>
              <p className="text-slate-600">Schritt {currentStep} von 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-sage-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-sage-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Protocol Type */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Protokoll-Typ wählen
                </CardTitle>
                <CardDescription>
                  Wählen Sie das Protokoll, das am besten zu Ihren Bedürfnissen passt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {protocolTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.type === type.id
                          ? `${type.color} border-current`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      onClick={() => handleInputChange('type', type.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${type.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {type.name}
                          </h3>
                          <p className="text-slate-600 mb-3">
                            {type.description}
                          </p>
                          <p className="text-sm text-slate-500">
                            {type.details}
                          </p>
                        </div>
                        {formData.type === type.id && (
                          <CheckCircle className="w-6 h-6 text-sage-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Protocol Details */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Protokoll-Details
                </CardTitle>
                <CardDescription>
                  Konfigurieren Sie die Details Ihres Protokolls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Protokoll-Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="z.B. Mein Fadiman Protokoll"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Startdatum</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cycleLength">Zyklus-Dauer (Wochen)</Label>
                  <div className="mt-2 flex space-x-2">
                    {[2, 3, 4, 5, 6].map((weeks) => (
                      <Button
                        key={weeks}
                        variant={formData.cycleLength === weeks ? "default" : "outline"}
                        onClick={() => handleInputChange('cycleLength', weeks)}
                        className="rounded-xl"
                      >
                        {weeks} Wochen
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Wochentag-Auswahl für benutzerdefinierte Protokolle */}
                {formData.type === 'custom' && (
                  <div>
                    <Label>Einnahmetage pro Woche wählen</Label>
                    <p className="text-sm text-slate-600 mb-4">
                      Wählen Sie die Wochentage aus, an denen Sie Ihre Mikrodosis einnehmen möchten (max. 4 Tage pro Woche).
                    </p>
                    <div className="grid grid-cols-7 gap-2">
                      {weekdays.map((day) => (
                        <Button
                          key={day.id}
                          variant={formData.customDays.includes(day.id) ? "default" : "outline"}
                          onClick={() => handleCustomDayToggle(day.id)}
                          className={`h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                            formData.customDays.includes(day.id)
                              ? 'bg-sage-600 text-white shadow-lg'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-medium">{day.short}</span>
                          <span className="text-xs opacity-75">{day.name}</span>
                        </Button>
                      ))}
                    </div>
                    {formData.customDays.length > 0 && (
                      <div className="mt-3 p-3 bg-sage-50 rounded-xl">
                        <p className="text-sm text-sage-700">
                          <strong>Ausgewählte Tage:</strong> {formData.customDays.map(dayId => weekdays.find(d => d.id === dayId)?.name).join(', ')}
                        </p>
                        <p className="text-xs text-sage-600 mt-1">
                          {formData.customDays.length} von maximal 4 Tagen ausgewählt
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Notifications */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Benachrichtigungen
                </CardTitle>
                <CardDescription>
                  Konfigurieren Sie Ihre Erinnerungen und Reflexionszeiten.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-slate-900">Morgendliche Erinnerung</h4>
                      <p className="text-sm text-slate-600">Erinnerung zur Einnahmezeit</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="time"
                        value={formData.morningReminder.time}
                        onChange={(e) => handleNestedInputChange('morningReminder', 'time', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        variant={formData.morningReminder.enabled ? "default" : "outline"}
                        onClick={() => handleNestedInputChange('morningReminder', 'enabled', !formData.morningReminder.enabled)}
                        size="sm"
                      >
                        {formData.morningReminder.enabled ? 'Aktiv' : 'Inaktiv'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-slate-900">Abendliche Reflexion</h4>
                      <p className="text-sm text-slate-600">Zeit für Tagesreflexion</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="time"
                        value={formData.eveningReflection.time}
                        onChange={(e) => handleNestedInputChange('eveningReflection', 'time', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        variant={formData.eveningReflection.enabled ? "default" : "outline"}
                        onClick={() => handleNestedInputChange('eveningReflection', 'enabled', !formData.eveningReflection.enabled)}
                        size="sm"
                      >
                        {formData.eveningReflection.enabled ? 'Aktiv' : 'Inaktiv'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  !formData.type || 
                  (currentStep === 2 && (!formData.name || !formData.startDate)) ||
                  (currentStep === 2 && formData.type === 'custom' && formData.customDays.length === 0)
                }
                className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Weiter
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createProtocolMutation.isPending}
                className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createProtocolMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Erstelle...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Protokoll erstellen
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
