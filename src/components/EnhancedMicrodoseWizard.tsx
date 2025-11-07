import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  AlertCircle,
  X,
  RotateCcw,
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

interface EnhancedMicrodoseWizardProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface StepValidation {
  isValid: boolean;
  errors: string[];
}

const steps = [
  {
    id: 1,
    title: 'Grunddaten',
    icon: Scale,
    description: 'Gewicht & Geschlecht',
    mobileTitle: 'Grunddaten',
  },
  { 
    id: 2, 
    title: 'Substanz', 
    icon: Leaf, 
    description: 'Wahl & Form',
    mobileTitle: 'Substanz',
  },
  {
    id: 3,
    title: 'Empfindlichkeit',
    icon: Heart,
    description: 'Persönliche Faktoren',
    mobileTitle: 'Empfindlichkeit',
  },
  { 
    id: 4, 
    title: 'Ziel', 
    icon: Brain, 
    description: 'Mikrodosierungs-Ziel',
    mobileTitle: 'Ziel',
  },
  {
    id: 5,
    title: 'Ergebnis',
    icon: Sparkles,
    description: 'Berechnung & Empfehlungen',
    mobileTitle: 'Ergebnis',
  },
];

export const EnhancedMicrodoseWizard: React.FC<EnhancedMicrodoseWizardProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<MicrodoseCalculationResult | null>(null);
  const [stepValidations, setStepValidations] = useState<Record<number, StepValidation>>({});
  const [showMobileProgress, setShowMobileProgress] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentStep > 1) {
        prevStep();
      } else if (e.key === 'ArrowRight' && currentStep < 5 && isStepValid(currentStep)) {
        if (currentStep === 4) {
          calculateMicrodose();
        } else {
          nextStep();
        }
      } else if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const fetchSubstances = async () => {
    setLoading(true);
    try {
      const substancesResponse = await fetch(
        'https://microdos-api-03a4b6586106.herokuapp.com/api/microdose/substances'
      );
      const data = await substancesResponse.json();
      setSubstances(data.substances);
    } catch (error) {
      console.error('Error fetching substances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Reset intake form when substance changes
    if (field === 'substance') {
      setFormData(prev => ({
        ...prev,
        substance: value,
        intakeForm: '',
      }));
    }

    // Clear validation errors when user makes changes
    if (stepValidations[currentStep]) {
      setStepValidations(prev => ({
        ...prev,
        [currentStep]: { isValid: true, errors: [] }
      }));
    }
  };

  const validateStep = (step: number): StepValidation => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.gender) errors.push('Bitte wählen Sie Ihr Geschlecht');
        if (!formData.weight) errors.push('Bitte geben Sie Ihr Gewicht ein');
        else if (parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 200) {
          errors.push('Gewicht muss zwischen 30 und 200 kg liegen');
        }
        break;
      case 2:
        if (!formData.substance) errors.push('Bitte wählen Sie eine Substanz');
        if (!formData.intakeForm) errors.push('Bitte wählen Sie eine Einnahmeform');
        break;
      case 3:
        if (!formData.sensitivity) errors.push('Bitte wählen Sie Ihre Empfindlichkeit');
        break;
      case 4:
        if (!formData.goal) errors.push('Bitte wählen Sie Ihr Mikrodosierungs-Ziel');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const isStepValid = (step: number): boolean => {
    return validateStep(step).isValid;
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    setStepValidations(prev => ({
      ...prev,
      [currentStep]: validation
    }));

    if (validation.isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Allow going back to completed steps
    if (step <= currentStep || step === 1) {
      setCurrentStep(step);
    }
  };

  const calculateMicrodose = async () => {
    const validation = validateStep(4);
    setStepValidations(prev => ({
      ...prev,
      [4]: validation
    }));

    if (!validation.isValid) return;

    setCalculating(true);
    try {
      const response = await fetch(
        'https://microdos-api-03a4b6586106.herokuapp.com/api/microdose/calculate-temporary',
        {
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
        }
      );

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
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

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData({
      gender: '',
      weight: '',
      substance: '',
      intakeForm: '',
      sensitivity: '1.0',
      goal: '',
      experience: '',
      currentMedication: '',
    });
    setResult(null);
    setStepValidations({});
  };

  const selectedSubstance = substances.find(s => s.id === formData.substance);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turquoise-100 to-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="h-8 w-8 text-turquoise-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Grunddaten
              </h3>
              <p className="text-slate-gray text-base md:text-lg">
                Erzählen Sie uns etwas über sich
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Geschlecht *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'male', label: 'Männlich', icon: '♂️' },
                    { value: 'female', label: 'Weiblich', icon: '♀️' },
                    { value: 'other', label: 'Andere', icon: '⚧' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('gender', option.value)}
                      className={`p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.gender === option.value
                          ? 'border-turquoise-500 bg-gradient-to-br from-turquoise-50 to-turquoise-100 text-turquoise-700 shadow-lg shadow-turquoise-200/50'
                          : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-md'
                      }`}
                    >
                      <div className="text-2xl md:text-3xl mb-3">{option.icon}</div>
                      <div className="text-sm md:text-base font-semibold">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Körpergewicht (kg) *
                </Label>
                <div className="relative max-w-xs mx-auto">
                  <Input
                    type="number"
                    min="30"
                    max="200"
                    value={formData.weight}
                    onChange={e => handleInputChange('weight', e.target.value)}
                    placeholder="z.B. 70"
                    className="text-center text-xl md:text-2xl py-4 md:py-6 rounded-2xl border-2 border-light-gray focus:border-turquoise-500 focus:ring-4 focus:ring-turquoise-100 transition-all duration-300"
                  />
                  <Scale className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turquoise-100 to-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-turquoise-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Substanz wählen
              </h3>
              <p className="text-slate-gray text-base md:text-lg">
                Welche Substanz möchten Sie mikrodosieren?
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Substanz *
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  {substances.map(substance => (
                    <button
                      key={substance.id}
                      onClick={() => handleInputChange('substance', substance.id)}
                      className={`p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                        formData.substance === substance.id
                          ? 'border-turquoise-500 bg-gradient-to-br from-turquoise-50 to-turquoise-100 text-turquoise-700 shadow-lg shadow-turquoise-200/50'
                          : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl md:text-3xl">
                          {substance.id === 'psilocybin' && '🍄'}
                          {substance.id === 'lsd' && '🌈'}
                          {substance.id === 'amanita' && '🍄'}
                          {substance.id === 'ketamine' && '💊'}
                        </div>
                        <div>
                          <div className="font-semibold text-base md:text-lg">
                            {substance.name}
                          </div>
                          <div className="text-sm opacity-75 mt-1">
                            {substance.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSubstance && (
                <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                  <Label className="text-charcoal font-semibold text-lg">
                    Einnahmeform *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedSubstance.intakeForms.map(form => (
                      <button
                        key={form.id}
                        onClick={() => handleInputChange('intakeForm', form.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          formData.intakeForm === form.id
                            ? 'border-turquoise-500 bg-gradient-to-br from-turquoise-50 to-turquoise-100 text-turquoise-700 shadow-md'
                            : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-sm'
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
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turquoise-100 to-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-turquoise-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Empfindlichkeit
              </h3>
              <p className="text-slate-gray text-base md:text-lg">
                Wie empfindlich reagieren Sie auf Substanzen?
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Empfindlichkeit *
                </Label>
                <div className="space-y-3">
                  {[
                    {
                      value: '0.5',
                      label: 'Sehr empfindlich',
                      desc: 'Reagiere stark auf kleine Mengen',
                      icon: '🌱',
                    },
                    {
                      value: '0.8',
                      label: 'Empfindlich',
                      desc: 'Etwas empfindlicher als normal',
                      icon: '🌿',
                    },
                    {
                      value: '1.0',
                      label: 'Normal',
                      desc: 'Durchschnittliche Empfindlichkeit',
                      icon: '🌳',
                    },
                    {
                      value: '1.2',
                      label: 'Weniger empfindlich',
                      desc: 'Brauche etwas mehr als normal',
                      icon: '🌲',
                    },
                    {
                      value: '1.5',
                      label: 'Wenig empfindlich',
                      desc: 'Brauche deutlich mehr',
                      icon: '🌴',
                    },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('sensitivity', option.value)}
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                        formData.sensitivity === option.value
                          ? 'border-turquoise-500 bg-gradient-to-br from-turquoise-50 to-turquoise-100 text-turquoise-700 shadow-lg shadow-turquoise-200/50'
                          : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-xl md:text-2xl">{option.icon}</div>
                        <div>
                          <div className="font-semibold text-base md:text-lg">
                            {option.label}
                          </div>
                          <div className="text-sm opacity-75 mt-1">
                            {option.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Erfahrung (optional)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'beginner', label: 'Anfänger', icon: '🌱' },
                    { value: 'intermediate', label: 'Fortgeschritten', icon: '🌿' },
                    { value: 'experienced', label: 'Erfahren', icon: '🌳' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('experience', option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.experience === option.value
                          ? 'border-turquoise-500 bg-gradient-to-br from-turquoise-50 to-turquoise-100 text-turquoise-700 shadow-md'
                          : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-sm'
                      }`}
                    >
                      <div className="text-xl md:text-2xl mb-2">{option.icon}</div>
                      <div className="text-xs font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-charcoal font-semibold text-lg">
                  Aktuelle Medikamente (optional)
                </Label>
                <Input
                  value={formData.currentMedication}
                  onChange={e => handleInputChange('currentMedication', e.target.value)}
                  placeholder="z.B. SSRI, Antidepressiva..."
                  className="rounded-2xl border-2 border-light-gray focus:border-turquoise-500 focus:ring-4 focus:ring-turquoise-100 py-4 text-base md:text-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turquoise-100 to-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-turquoise-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Mikrodosierungs-Ziel
              </h3>
              <p className="text-slate-gray text-base md:text-lg">
                Was möchten Sie mit der Mikrodosierung erreichen?
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  value: 'sub_perceptual',
                  label: 'Sub-perzeptuell',
                  desc: '5% der Normaldosis - völlig unmerklich, rein funktional',
                  icon: '🌙',
                  color: 'bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-300 text-lavender-700',
                },
                {
                  value: 'standard',
                  label: 'Standard',
                  desc: '10% der Normaldosis - klassische Mikrodosierung',
                  icon: '☀️',
                  color: 'bg-gradient-to-br from-turquoise-50 to-turquoise-100 border-turquoise-300 text-turquoise-700',
                },
                {
                  value: 'upper_microdose',
                  label: 'Obere Mikrodosis',
                  desc: '20% der Normaldosis - leichte spürbare Effekte',
                  icon: '⚡',
                  color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-700',
                },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('goal', option.value)}
                  disabled={calculating}
                  className={`p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                    formData.goal === option.value
                      ? `${option.color} border-opacity-100 shadow-lg`
                      : 'border-light-gray hover:border-turquoise-300 text-slate-gray hover:shadow-md'
                  } ${calculating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl md:text-3xl">{option.icon}</div>
                    <div>
                      <div className="font-semibold text-base md:text-lg">
                        {option.label}
                      </div>
                      <div className="text-sm opacity-75 mt-1">
                        {option.desc}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Loading Overlay */}
            {calculating && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-turquoise-200 border-t-turquoise-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-3">
                    Berechne Ihre Mikrodosis...
                  </h3>
                  <p className="text-slate-gray text-base md:text-lg">
                    Dies kann einen Moment dauern
                  </p>
                  <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-turquoise-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-turquoise-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-turquoise-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turquoise-100 to-turquoise-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-turquoise-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Ihre Mikrodosis
              </h3>
              <p className="text-slate-gray text-base md:text-lg">
                Personalisierte Berechnung basierend auf Ihren Angaben
              </p>
            </div>

            {result && (
              <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                {/* Main Result */}
                <div className="text-center p-6 md:p-10 bg-gradient-to-br from-turquoise-50 via-white to-lavender-50 rounded-3xl border-2 border-turquoise-200/50 shadow-xl">
                  <div className="text-4xl md:text-6xl font-bold text-turquoise-700 mb-3 tracking-tight">
                    {result.calculatedDose} {result.doseUnit}
                  </div>
                  <div className="text-lg md:text-xl text-turquoise-600 font-semibold mb-2">
                    Empfohlene Mikrodosis
                  </div>
                  <div className="text-sm bg-white/60 px-4 py-2 rounded-full inline-block">
                    {selectedSubstance?.name} • {selectedSubstance?.intakeForms.find(f => f.id === formData.intakeForm)?.name}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-6">
                  <h4 className="font-bold text-charcoal text-lg md:text-xl flex items-center">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-turquoise-600 mr-3" />
                    Wichtige Empfehlungen
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-turquoise-50 to-turquoise-100/50 rounded-2xl border border-turquoise-200/50">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-turquoise-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="text-slate-700 leading-relaxed text-sm md:text-base">
                          {rec}
                        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-soft-white via-white to-turquoise-50/30">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 rounded-2xl border border-light-gray/50 shadow-sm mb-4 md:mb-6">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-turquoise-500 to-turquoise-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-slate-700 font-semibold text-base md:text-lg">
                Mikrodosierungs-Berechner
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-3 md:mb-4 tracking-tight">
              Präzise Mikrodosierung
            </h1>
            <p className="text-slate-gray text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Wissenschaftlich fundierte Berechnung für eine sichere und effektive Mikrodosierung
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 md:mb-16">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-8 md:left-12 right-8 md:right-12 h-0.5 bg-light-gray/60 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-turquoise-500 via-turquoise-400 to-turquoise-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{
                      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex items-center justify-between md:justify-center md:space-x-8">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center relative z-10 group cursor-pointer"
                        onClick={() => goToStep(step.id)}
                      >
                        {/* Step Circle */}
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out ${
                            isCompleted
                              ? 'bg-gradient-to-br from-turquoise-500 to-turquoise-600 border-turquoise-500 text-white shadow-lg shadow-turquoise-200/50 scale-110'
                              : isActive
                              ? 'bg-white border-turquoise-500 text-turquoise-600 shadow-lg shadow-turquoise-100/50 scale-105'
                              : 'bg-white/80 border-light-gray text-slate-400 shadow-sm hover:border-turquoise-300 hover:text-turquoise-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <Icon className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </div>

                        {/* Step Info - Hidden on mobile, shown on hover */}
                        <div className="hidden md:block mt-3 text-center max-w-20">
                          <div
                            className={`text-xs font-semibold transition-all duration-300 ${
                              isActive
                                ? 'text-turquoise-700 scale-105'
                                : isCompleted
                                ? 'text-turquoise-600'
                                : 'text-slate-500 group-hover:text-turquoise-600'
                            }`}
                          >
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

                {/* Mobile Progress Toggle */}
                <div className="md:hidden text-center mt-6">
                  <button
                    onClick={() => setShowMobileProgress(!showMobileProgress)}
                    className="inline-flex items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-light-gray/50 shadow-sm text-sm text-slate-600 hover:text-turquoise-600 transition-colors duration-200"
                  >
                    <span>Schritt {currentStep} von {steps.length}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${showMobileProgress ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Mobile Progress Details */}
                {showMobileProgress && (
                  <div className="md:hidden mt-4 space-y-2">
                    {steps.map((step, index) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = currentStep > step.id;
                      const Icon = step.icon;

                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            goToStep(step.id);
                            setShowMobileProgress(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-turquoise-50 border-turquoise-200 text-turquoise-700'
                              : isCompleted
                              ? 'bg-turquoise-100/50 border-turquoise-100 text-turquoise-600'
                              : 'bg-white/50 border-light-gray text-slate-500'
                          } border`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-turquoise-500 text-white'
                              : isActive
                              ? 'bg-turquoise-100 text-turquoise-600'
                              : 'bg-light-gray text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-sm">{step.mobileTitle}</div>
                            <div className="text-xs opacity-75">{step.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step Counter */}
                <div className="text-center mt-6 md:mt-8">
                  <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full border border-light-gray/50 shadow-sm">
                    <div className="flex space-x-1">
                      {Array.from({ length: steps.length }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < currentStep ? 'bg-turquoise-500' : 'bg-light-gray'
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
            <CardContent className="p-6 md:p-12 relative" ref={contentRef}>
              {/* Validation Errors */}
              {stepValidations[currentStep]?.errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Bitte korrigieren Sie folgende Fehler:</h4>
                      <ul className="space-y-1">
                        {stepValidations[currentStep].errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-700">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {renderStepContent()}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 md:mt-12">
            <div className="flex items-center space-x-3">
              <Button
                onClick={currentStep === 1 ? onBack : prevStep}
                variant="outline"
                className="rounded-2xl border-light-gray/60 hover:border-turquoise-300 text-slate-600 hover:text-turquoise-700 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 transition-all duration-300 hover:shadow-md"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {currentStep === 1 ? 'Zurück' : 'Vorheriger Schritt'}
                </span>
                <span className="sm:hidden">Zurück</span>
              </Button>

              {currentStep > 1 && (
                <Button
                  onClick={resetWizard}
                  variant="outline"
                  className="rounded-2xl border-light-gray/60 hover:border-red-300 text-slate-600 hover:text-red-700 bg-white/80 backdrop-blur-sm px-3 py-3 transition-all duration-300 hover:shadow-md"
                  title="Neu starten"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {currentStep < 5 ? (
                <Button
                  onClick={currentStep === 4 ? calculateMicrodose : nextStep}
                  disabled={!isStepValid(currentStep) || calculating}
                  className="rounded-2xl bg-gradient-to-r from-turquoise-600 to-turquoise-700 hover:from-turquoise-700 hover:to-turquoise-800 text-white px-6 md:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {calculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="font-medium hidden sm:inline">Berechne Ihre Mikrodosis...</span>
                      <span className="font-medium sm:hidden">Berechne...</span>
                    </>
                  ) : currentStep === 4 ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      <span className="font-medium hidden sm:inline">Mikrodosis berechnen</span>
                      <span className="font-medium sm:hidden">Berechnen</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium hidden sm:inline">Nächster Schritt</span>
                      <span className="font-medium sm:hidden">Weiter</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="rounded-2xl bg-gradient-to-r from-turquoise-600 to-turquoise-700 hover:from-turquoise-700 hover:to-turquoise-800 text-white px-6 md:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span className="font-medium hidden sm:inline">Mit dieser Berechnung fortfahren</span>
                  <span className="font-medium sm:hidden">Fortfahren</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMicrodoseWizard;



