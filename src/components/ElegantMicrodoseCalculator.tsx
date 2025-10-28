import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  Leaf, 
  Scale, 
  Calendar, 
  Heart,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Substance {
  id: string;
  name: string;
  description: string;
  intakeForms: Array<{
    id: string;
    name: string;
  }>;
}

interface MicrodoseCalculationResult {
  calculatedDose: number;
  doseUnit: string;
  baseDose: number;
  weightFactor: number;
  sensitivityFactor: number;
  goalFactor: number;
  intakeFormFactor: number;
  explanation: string;
  recommendations: string[];
}

interface ElegantMicrodoseCalculatorProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const steps = [
  { id: 1, title: 'Grunddaten', icon: Scale, description: 'Gewicht & Geschlecht' },
  { id: 2, title: 'Substanz', icon: Leaf, description: 'Wahl & Form' },
  { id: 3, title: 'Empfindlichkeit', icon: Heart, description: 'Persönliche Faktoren' },
  { id: 4, title: 'Ziel', icon: Brain, description: 'Mikrodosierungs-Ziel' },
  { id: 5, title: 'Ergebnis', icon: Sparkles, description: 'Berechnung & Empfehlungen' }
];

export const ElegantMicrodoseCalculator: React.FC<ElegantMicrodoseCalculatorProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<MicrodoseCalculationResult | null>(null);
  
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    substance: '',
    intakeForm: '',
    sensitivity: '1.0',
    goal: '',
    experience: '',
    currentMedication: '',
  });

  useEffect(() => {
    fetchSubstances();
  }, []);

  const fetchSubstances = async () => {
    try {
      const substancesResponse = await fetch('/api/microdose/substances');
      const data = await substancesResponse.json();
      setSubstances(data.substances);
    } catch (error) {
      console.error('Error fetching substances:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === 'substance') {
      setFormData(prev => ({
        ...prev,
        substance: value,
        intakeForm: '',
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMicrodose = async () => {
    if (!formData.gender || !formData.weight || !formData.substance || 
        !formData.intakeForm || !formData.goal) {
      return;
    }

    setCalculating(true);
    try {
      // Use the correct API endpoint for temporary calculation
      const response = await fetch('/api/microdose/calculate-temporary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: formData.gender,
          weight: parseFloat(formData.weight),
          substance: formData.substance,
          intakeForm: formData.intakeForm,
          sensitivity: parseFloat(formData.sensitivity),
          goal: formData.goal,
          experience: formData.experience || undefined,
          currentMedication: formData.currentMedication || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        // Add a small delay to show the calculation process
        setTimeout(() => {
          setCurrentStep(5);
        }, 1000);
      } else {
        console.error('Calculation failed:', data.error);
        setCalculating(false);
      }
    } catch (error) {
      console.error('Error calculating microdose:', error);
      setCalculating(false);
    }
  };

  const handleContinue = () => {
    if (!result) return;
    onComplete({
      ...formData,
      calculatedDose: result.calculatedDose,
      doseUnit: result.doseUnit,
      calculationResult: result,
    });
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.gender && formData.weight;
      case 2:
        return formData.substance && formData.intakeForm;
      case 3:
        return formData.sensitivity && formData.experience;
      case 4:
        return formData.goal;
      default:
        return true;
    }
  };

  const selectedSubstance = substances.find(s => s.id === formData.substance);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Grunddaten</h3>
              <p className="text-slate-600 text-lg">Erzählen Sie uns etwas über sich</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Geschlecht</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'male', label: 'Männlich', icon: '♂️' },
                    { value: 'female', label: 'Weiblich', icon: '♀️' },
                    { value: 'other', label: 'Andere', icon: '⚧' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('gender', option.value)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.gender === option.value
                          ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                          : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-3">{option.icon}</div>
                      <div className="text-sm font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Körpergewicht (kg)</Label>
                <div className="relative max-w-xs mx-auto">
                  <Input
                    type="number"
                    min="30"
                    max="200"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="z.B. 70"
                    className="text-center text-2xl py-6 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                  />
                  <Scale className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Substanz wählen</h3>
              <p className="text-slate-600 text-lg">Welche Substanz möchten Sie mikrodosieren?</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Substanz</Label>
                <div className="grid grid-cols-1 gap-4">
                  {substances.map((substance) => (
                    <button
                      key={substance.id}
                      onClick={() => handleInputChange('substance', substance.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                        formData.substance === substance.id
                          ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                          : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {substance.id === 'psilocybin' && '🍄'}
                          {substance.id === 'lsd' && '🌈'}
                          {substance.id === 'amanita' && '🍄'}
                          {substance.id === 'ketamine' && '💊'}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{substance.name}</div>
                          <div className="text-sm opacity-75 mt-1">{substance.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSubstance && (
                <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                  <Label className="text-slate-800 font-semibold text-lg">Einnahmeform</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedSubstance.intakeForms.map((form) => (
                      <button
                        key={form.id}
                        onClick={() => handleInputChange('intakeForm', form.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          formData.intakeForm === form.id
                            ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-md'
                            : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-sm'
                        }`}
                      >
                        <div className="text-sm font-semibold">{form.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Empfindlichkeit</h3>
              <p className="text-slate-600 text-lg">Wie empfindlich reagieren Sie auf Substanzen?</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Empfindlichkeit</Label>
                <div className="space-y-3">
                  {[
                    { value: '0.5', label: 'Sehr empfindlich', desc: 'Reagiere stark auf kleine Mengen', icon: '🌱' },
                    { value: '0.8', label: 'Empfindlich', desc: 'Etwas empfindlicher als normal', icon: '🌿' },
                    { value: '1.0', label: 'Normal', desc: 'Durchschnittliche Empfindlichkeit', icon: '🌳' },
                    { value: '1.2', label: 'Weniger empfindlich', desc: 'Brauche etwas mehr als normal', icon: '🌲' },
                    { value: '1.5', label: 'Wenig empfindlich', desc: 'Brauche deutlich mehr', icon: '🌴' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('sensitivity', option.value)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                        formData.sensitivity === option.value
                          ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                          : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{option.icon}</div>
                        <div>
                          <div className="font-semibold text-lg">{option.label}</div>
                          <div className="text-sm opacity-75 mt-1">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Erfahrung (optional)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'beginner', label: 'Anfänger', icon: '🌱' },
                    { value: 'intermediate', label: 'Fortgeschritten', icon: '🌿' },
                    { value: 'experienced', label: 'Erfahren', icon: '🌳' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('experience', option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.experience === option.value
                          ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-md'
                          : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-xs font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-slate-800 font-semibold text-lg">Aktuelle Medikamente (optional)</Label>
                <Input
                  value={formData.currentMedication}
                  onChange={(e) => handleInputChange('currentMedication', e.target.value)}
                  placeholder="z.B. SSRI, Antidepressiva..."
                  className="rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 py-4 text-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Mikrodosierungs-Ziel</h3>
              <p className="text-slate-600 text-lg">Was möchten Sie mit der Mikrodosierung erreichen?</p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  value: 'sub_perceptual', 
                  label: 'Sub-perzeptuell', 
                  desc: '5% der Normaldosis - völlig unmerklich, rein funktional',
                  icon: '🌙',
                  color: 'bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-300 text-lavender-700'
                },
                { 
                  value: 'standard', 
                  label: 'Standard', 
                  desc: '10% der Normaldosis - klassische Mikrodosierung',
                  icon: '☀️',
                  color: 'bg-gradient-to-br from-sage-50 to-sage-100 border-sage-300 text-sage-700'
                },
                { 
                  value: 'upper_microdose', 
                  label: 'Obere Mikrodosis', 
                  desc: '20% der Normaldosis - leichte spürbare Effekte',
                  icon: '⚡',
                  color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-700'
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('goal', option.value)}
                  disabled={calculating}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                    formData.goal === option.value
                      ? `${option.color} border-opacity-100 shadow-lg`
                      : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                  } ${calculating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div>
                      <div className="font-semibold text-lg">{option.label}</div>
                      <div className="text-sm opacity-75 mt-1">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Loading Overlay */}
            {calculating && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Berechne Ihre Mikrodosis...</h3>
                  <p className="text-slate-600 text-lg">Dies kann einen Moment dauern</p>
                  <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Ihre Mikrodosis</h3>
              <p className="text-slate-600 text-lg">Personalisierte Berechnung basierend auf Ihren Angaben</p>
            </div>
            
            {result && (
              <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                {/* Main Result */}
                <div className="text-center p-10 bg-gradient-to-br from-sage-50 via-white to-lavender-50 rounded-3xl border-2 border-sage-200/50 shadow-xl">
                  <div className="text-6xl font-bold text-sage-700 mb-3 tracking-tight">
                    {result.calculatedDose} {result.doseUnit}
                  </div>
                  <div className="text-xl text-sage-600 font-semibold mb-2">
                    Empfohlene Mikrodosis
                  </div>
                  <div className="text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full inline-block">
                    {selectedSubstance?.name} • {selectedSubstance?.intakeForms.find(f => f.id === formData.intakeForm)?.name}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 text-xl flex items-center">
                    <CheckCircle className="h-6 w-6 text-sage-600 mr-3" />
                    Wichtige Empfehlungen
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-sage-50 to-sage-100/50 rounded-2xl border border-sage-200/50">
                        <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="text-slate-700 leading-relaxed">{rec}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
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
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-700 font-semibold text-lg">Mikrodosierungs-Berechner</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Präzise Mikrodosierung
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Wissenschaftlich fundierte Berechnung für eine sichere und effektive Mikrodosierung
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-16">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-200/60 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-sage-500 via-sage-400 to-sage-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex items-center justify-center space-x-8">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center relative z-10 group">
                        {/* Step Circle */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-sage-500 to-sage-600 border-sage-500 text-white shadow-lg shadow-sage-200/50 scale-110' 
                            : isActive 
                            ? 'bg-white border-sage-500 text-sage-600 shadow-lg shadow-sage-100/50 scale-105' 
                            : 'bg-white/80 border-slate-200 text-slate-400 shadow-sm hover:border-slate-300 hover:text-slate-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="mt-3 text-center max-w-20">
                          <div className={`text-xs font-semibold transition-all duration-300 ${
                            isActive ? 'text-sage-700 scale-105' : isCompleted ? 'text-sage-600' : 'text-slate-500 group-hover:text-slate-600'
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Step Counter */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200/50 shadow-sm">
                    <div className="flex space-x-1">
                      {Array.from({ length: steps.length }, (_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < currentStep ? 'bg-sage-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {currentStep} / {steps.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {renderStepContent()}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              onClick={currentStep === 1 ? onBack : prevStep}
              variant="outline"
              className="rounded-2xl border-slate-200/60 hover:border-slate-300 text-slate-600 hover:text-slate-700 bg-white/80 backdrop-blur-sm px-6 py-3 transition-all duration-300 hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Zurück' : 'Vorheriger Schritt'}
            </Button>

            <div className="flex items-center space-x-3">
              {currentStep < 5 ? (
                <Button
                  onClick={currentStep === 4 ? calculateMicrodose : nextStep}
                  disabled={!isStepValid(currentStep) || calculating}
                  className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {calculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="font-medium">Berechne Ihre Mikrodosis...</span>
                    </>
                  ) : currentStep === 4 ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      <span className="font-medium">Mikrodosis berechnen</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Nächster Schritt</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span className="font-medium">Mit dieser Berechnung fortfahren</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
