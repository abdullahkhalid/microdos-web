import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import { 
  GenderIcons, 
  SubstanceIcons, 
  IntakeFormIcons, 
  GoalIcons, 
  ExperienceIcons
} from './icons/SelectionIcons';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles,
  Weight,
  Calculator,
  Target,
  Brain,
  Award,
  Mail,
  User,
  Lock,
  ArrowRight
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

interface LeadMagnetCalculatorProps {
  onSuccess: (user: any, profile: any) => void;
  onBack: () => void;
}

type Step = 'gender' | 'weight' | 'substance' | 'intakeForm' | 'sensitivity' | 'goal' | 'experience' | 'result' | 'registration';

const STEPS: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'gender', title: 'Geschlecht', icon: <GenderIcons.male className="w-5 h-5" /> },
  { id: 'weight', title: 'Gewicht', icon: <Weight className="w-5 h-5" /> },
  { id: 'substance', title: 'Substanz', icon: <SubstanceIcons.psilocybin className="w-5 h-5" /> },
  { id: 'intakeForm', title: 'Einnahmeform', icon: <IntakeFormIcons.dried_mushrooms className="w-5 h-5" /> },
  { id: 'sensitivity', title: 'Empfindlichkeit', icon: <Brain className="w-5 h-5" /> },
  { id: 'goal', title: 'Ziel', icon: <Target className="w-5 h-5" /> },
  { id: 'experience', title: 'Erfahrung', icon: <Award className="w-5 h-5" /> },
  { id: 'result', title: 'Ergebnis', icon: <Calculator className="w-5 h-5" /> },
  { id: 'registration', title: 'Registrierung', icon: <Mail className="w-5 h-5" /> }
];

export const LeadMagnetCalculator: React.FC<LeadMagnetCalculatorProps> = ({
  onSuccess,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [result, setResult] = useState<MicrodoseCalculationResult | null>(null);
  const [tempCalculationId, setTempCalculationId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    substance: '',
    intakeForm: '',
    sensitivity: 1.0,
    goal: '',
    experience: '',
    currentMedication: '',
  });

  const [registrationData, setRegistrationData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchSubstances();
  }, []);

  const fetchSubstances = async () => {
    try {
      const response = await apiClient.getSubstances();
      setSubstances(response.substances);
    } catch (error) {
      console.error('Error fetching substances:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
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

    // Auto-advance to next step for single-choice fields
    const autoAdvanceFields = ['gender', 'substance', 'intakeForm', 'goal', 'experience'];
    if (autoAdvanceFields.includes(field)) {
      setTimeout(() => {
        if (currentStep < STEPS.length - 2) { // Don't auto-advance to registration
          setCurrentStep(currentStep + 1);
        }
      }, 500);
    }

    // Trigger calculation when experience is selected
    if (field === 'experience') {
      setTimeout(() => {
        console.log('Starting calculation from experience selection');
        calculateMicrodose();
      }, 600); // Slightly longer delay to ensure state is updated
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMicrodose = async () => {
    setCalculating(true);
    try {
      console.log('Starting calculation with data:', formData);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Berechnung dauerte zu lange')), 10000)
      );
      
      const calculationPromise = apiClient.calculateMicrodoseTemporary({
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        substance: formData.substance,
        intakeForm: formData.intakeForm,
        sensitivity: formData.sensitivity,
        goal: formData.goal,
        experience: formData.experience,
        currentMedication: formData.currentMedication,
      });

      const response = await Promise.race([calculationPromise, timeoutPromise]) as any;
      console.log('Calculation response:', response);

      if (response.success) {
        setResult(response.result);
        setTempCalculationId(response.tempCalculationId);
        setCurrentStep(STEPS.length - 2); // Go to result step
      } else {
        console.error('Calculation failed:', response);
        alert('Berechnung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Error calculating microdose:', error);
      alert('Fehler bei der Berechnung: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
    } finally {
      setCalculating(false);
    }
  };

  const handleRegistration = async () => {
    if (registrationData.password !== registrationData.confirmPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    if (!tempCalculationId) {
      alert('Keine Berechnung gefunden');
      return;
    }

    setRegistering(true);
    try {
      const response = await apiClient.registerWithCalculation({
        email: registrationData.email,
        name: registrationData.name,
        password: registrationData.password,
        tempCalculationId,
      });

      if (response.success) {
        onSuccess(response.user, response.profile);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setRegistering(false);
    }
  };

  const currentStepData = STEPS[currentStep];
  const selectedSubstance = substances.find(s => s.id === formData.substance);

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'gender':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-turquoise/10 rounded-large flex items-center justify-center mx-auto mb-6">
                <GenderIcons.male className="h-10 w-10 text-turquoise" />
              </div>
              <h3 className="text-3xl font-bold text-charcoal mb-3">Geschlecht</h3>
              <p className="text-slate-gray text-lg">Dies hilft bei der personalisierten Berechnung</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'male', label: 'Männlich', icon: GenderIcons.male, color: 'blue' },
                { id: 'female', label: 'Weiblich', icon: GenderIcons.female, color: 'pink' },
                { id: 'other', label: 'Andere', icon: GenderIcons.other, color: 'purple' }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('gender', option.id)}
                    className={`p-6 rounded-medium border-2 transition-all duration-300 hover:scale-105 ${
                      formData.gender === option.id
                        ? 'border-turquoise bg-turquoise/5 text-turquoise shadow-lg shadow-turquoise/20'
                        : 'border-light-gray hover:border-turquoise/50 text-slate-gray hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-medium ${
                        formData.gender === option.id ? 'bg-turquoise/10' : 'bg-light-gray/50'
                      }`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">{option.label}</div>
                      </div>
                      {formData.gender === option.id && (
                        <Check className="w-6 h-6 text-turquoise ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Weight className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Körpergewicht</h3>
              <p className="text-slate-600 text-lg">Geben Sie Ihr Gewicht in Kilogramm ein</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="relative">
                <Input
                  type="number"
                  min="30"
                  max="200"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="z.B. 70"
                  className="text-center text-2xl py-6 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                />
                <Weight className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium text-lg">
                  kg
                </span>
              </div>
            </div>
          </div>
        );

      case 'substance':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SubstanceIcons.psilocybin className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Substanz wählen</h3>
              <p className="text-slate-600 text-lg">Für welche Substanz möchten Sie eine Mikrodosis berechnen?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {substances.map((substance) => {
                const IconComponent = SubstanceIcons[substance.id as keyof typeof SubstanceIcons];
                return (
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
                      <div className={`p-3 rounded-xl ${
                        formData.substance === substance.id ? 'bg-sage-100' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-lg">{substance.name}</div>
                        <div className="text-sm opacity-75 mt-1">{substance.description}</div>
                      </div>
                      {formData.substance === substance.id && (
                        <Check className="w-6 h-6 text-sage-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'intakeForm':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IntakeFormIcons.dried_mushrooms className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Einnahmeform</h3>
              <p className="text-slate-600 text-lg">In welcher Form möchten Sie die Substanz einnehmen?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {selectedSubstance?.intakeForms.map((form) => {
                const IconComponent = IntakeFormIcons[form.id as keyof typeof IntakeFormIcons];
                return (
                  <button
                    key={form.id}
                    onClick={() => handleInputChange('intakeForm', form.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      formData.intakeForm === form.id
                        ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-md'
                        : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        formData.intakeForm === form.id ? 'bg-sage-100' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold">{form.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'sensitivity':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Empfindlichkeit</h3>
              <p className="text-slate-600 text-lg">Wie empfindlich reagieren Sie auf psychedelische Substanzen?</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl border border-sage-200">
                <div className="text-3xl font-bold text-sage-700 mb-2">{formData.sensitivity}x</div>
                <div className="text-sm text-slate-600">Empfindlichkeitsfaktor</div>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={formData.sensitivity}
                  onChange={(e) => handleInputChange('sensitivity', parseFloat(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-sage-100"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${((formData.sensitivity - 0.5) / 1) * 100}%, #e2e8f0 ${((formData.sensitivity - 0.5) / 1) * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Sehr empfindlich (0.5x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Wenig empfindlich (1.5x)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Mikrodosierungs-Ziel</h3>
              <p className="text-slate-600 text-lg">Was möchten Sie mit der Mikrodosierung erreichen?</p>
            </div>
            <div className="space-y-4">
              {[
                { 
                  id: 'sub_perceptual', 
                  label: 'Sub-perzeptuell', 
                  description: '5% der Normaldosis - kaum spürbar',
                  icon: GoalIcons.sub_perceptual,
                  color: 'bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-300 text-lavender-700'
                },
                { 
                  id: 'standard', 
                  label: 'Standard', 
                  description: '10% der Normaldosis - typische Mikrodosis',
                  icon: GoalIcons.standard,
                  color: 'bg-gradient-to-br from-sage-50 to-sage-100 border-sage-300 text-sage-700'
                },
                { 
                  id: 'upper_microdose', 
                  label: 'Obere Mikrodosis', 
                  description: '20% der Normaldosis - leicht spürbar',
                  icon: GoalIcons.upper_microdose,
                  color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-700'
                }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('goal', option.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                      formData.goal === option.id
                        ? `${option.color} border-opacity-100 shadow-lg`
                        : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        formData.goal === option.id ? 'bg-white/60' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-lg">{option.label}</div>
                        <div className="text-sm opacity-75 mt-1">{option.description}</div>
                      </div>
                      {formData.goal === option.id && (
                        <Check className="w-6 h-6 text-sage-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Erfahrung (Optional)</h3>
              <p className="text-slate-600 text-lg">Wie erfahren sind Sie mit psychedelischen Substanzen?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  id: 'beginner', 
                  label: 'Anfänger', 
                  description: 'Wenig bis keine Erfahrung',
                  icon: ExperienceIcons.beginner,
                  color: 'blue'
                },
                { 
                  id: 'intermediate', 
                  label: 'Fortgeschritten', 
                  description: 'Einige Erfahrungen vorhanden',
                  icon: ExperienceIcons.intermediate,
                  color: 'green'
                },
                { 
                  id: 'experienced', 
                  label: 'Erfahren', 
                  description: 'Viel Erfahrung mit Psychedelika',
                  icon: ExperienceIcons.experienced,
                  color: 'purple'
                }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('experience', option.id)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full hover:scale-[1.01] ${
                      formData.experience === option.id
                        ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                        : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        formData.experience === option.id ? 'bg-sage-100' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-lg">{option.label}</div>
                        <div className="text-sm opacity-75 mt-1">{option.description}</div>
                      </div>
                      {formData.experience === option.id && (
                        <Check className="w-6 h-6 text-sage-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'result':
        if (!result) {
          return (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Berechne Ihre Mikrodosis...</h3>
              <p className="text-slate-600 text-lg">Dies kann einen Moment dauern</p>
              <div className="mt-4 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Ihre Mikrodosis</h3>
              <p className="text-slate-600 text-lg">Personalisierte Berechnung basierend auf Ihren Angaben</p>
            </div>
            
            <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              {/* Main Result */}
              <div className="text-center p-10 bg-gradient-to-br from-sage-50 via-white to-lavender-50 rounded-3xl border-2 border-sage-200/50 shadow-xl">
                <div className="text-6xl font-bold text-sage-700 mb-3 tracking-tight">
                  {result.calculatedDose.toFixed(1)} {result.doseUnit}
                </div>
                <div className="text-xl text-sage-600 font-semibold mb-2">
                  Empfohlene Mikrodosis
                </div>
                <div className="text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full inline-block">
                  {selectedSubstance?.name} • {selectedSubstance?.intakeForms.find(f => f.id === formData.intakeForm)?.name}
                </div>
              </div>

              {/* Calculation Details */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-900 text-lg">Berechnungsdetails:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Basisdosis:</span>
                    <span className="font-semibold text-slate-800">{result.baseDose} {result.doseUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gewichtsfaktor:</span>
                    <span className="font-semibold text-slate-800">{result.weightFactor.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Empfindlichkeit:</span>
                    <span className="font-semibold text-slate-800">{result.sensitivityFactor.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ziel-Faktor:</span>
                    <span className="font-semibold text-slate-800">{result.goalFactor.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl p-6 border border-sage-200">
                <h4 className="font-bold text-slate-900 text-lg mb-3">Erklärung:</h4>
                <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center">
                    <Check className="h-6 w-6 text-sage-600 mr-3" />
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
              )}

              {/* Registration CTA */}
              <div className="bg-gradient-to-br from-sage-50 via-white to-lavender-50 rounded-2xl p-8 text-center border-2 border-sage-200/50">
                <h4 className="font-bold text-slate-900 text-xl mb-3">🔒 Sichern Sie Ihr Ergebnis</h4>
                <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                  Registrieren Sie sich kostenlos, um Ihr Mikrodosierungs-Profil zu speichern und weitere personalisierte Empfehlungen zu erhalten.
                </p>
                <Button
                  onClick={nextStep}
                  className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Kostenlos registrieren
                </Button>
              </div>
            </div>
          </div>
        );

      case 'registration':
        return (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Kostenlose Registrierung</h3>
              <p className="text-slate-600 text-lg">Sichern Sie Ihr Mikrodosierungs-Profil</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <Label htmlFor="name" className="text-slate-800 font-semibold text-lg">Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ihr Name"
                    className="pl-12 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-800 font-semibold text-lg">E-Mail</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ihre@email.com"
                    className="pl-12 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-800 font-semibold text-lg">Passwort</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mindestens 6 Zeichen"
                    className="pl-12 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-slate-800 font-semibold text-lg">Passwort bestätigen</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registrationData.confirmPassword}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Passwort wiederholen"
                    className="pl-12 py-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl p-6 text-center border border-sage-200">
              <div className="space-y-2">
                <p className="text-slate-700 font-medium">✅ Ihr Mikrodosierungs-Profil wird automatisch gespeichert</p>
                <p className="text-slate-700 font-medium">✅ Kostenloser Zugang zu weiteren Tools</p>
                <p className="text-slate-700 font-medium">✅ Personalisierte Empfehlungen</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case 'gender':
        return formData.gender !== '';
      case 'weight':
        return formData.weight !== '' && parseFloat(formData.weight) > 0;
      case 'substance':
        return formData.substance !== '';
      case 'intakeForm':
        return formData.intakeForm !== '';
      case 'sensitivity':
        return true;
      case 'goal':
        return formData.goal !== '';
      case 'experience':
        return true;
      case 'result':
        return result !== null;
      case 'registration':
        return registrationData.email !== '' && 
               registrationData.name !== '' && 
               registrationData.password !== '' && 
               registrationData.password === registrationData.confirmPassword;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStepData.id === 'experience') {
      console.log('Starting calculation from experience step');
      calculateMicrodose();
    } else if (currentStepData.id === 'registration') {
      handleRegistration();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md px-8 py-4 rounded-medium border border-light-gray/50 shadow-soft mb-6">
              <div className="w-8 h-8 bg-turquoise rounded-medium flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-charcoal font-semibold text-lg">Mikrodosierungs-Berechner</span>
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4 tracking-tight">
              Präzise Mikrodosierung
            </h1>
            <p className="text-slate-gray text-lg max-w-2xl mx-auto leading-relaxed">
              Personalisierte Berechnung Ihrer optimalen Mikrodosis
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-12 right-12 h-0.5 bg-light-gray/60 rounded-full">
                  <div 
                    className="h-full bg-turquoise rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex items-center justify-center space-x-4">
                  {STEPS.map((step, index) => {
                    const isActive = currentStep === index;
                    const isCompleted = currentStep > index;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center relative z-10 group">
                        {/* Step Circle */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out ${
                          isCompleted 
                            ? 'bg-turquoise border-turquoise text-white shadow-lg shadow-turquoise/20 scale-110' 
                            : isActive 
                            ? 'bg-white border-turquoise text-turquoise shadow-lg shadow-turquoise/10 scale-105' 
                            : 'bg-white/80 border-light-gray text-slate-gray shadow-sm hover:border-slate-gray hover:text-slate-gray'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <div className="scale-75">{step.icon}</div>
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="mt-3 text-center max-w-16">
                          <div className={`text-xs font-semibold transition-all duration-300 ${
                            isActive ? 'text-turquoise scale-105' : isCompleted ? 'text-turquoise' : 'text-slate-gray group-hover:text-slate-gray'
                          }`}>
                            {step.title}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Step Counter */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-light-gray/50 shadow-soft">
                    <div className="flex space-x-1">
                      {Array.from({ length: STEPS.length }, (_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i <= currentStep ? 'bg-turquoise' : 'bg-light-gray'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-gray">
                      {currentStep + 1} / {STEPS.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="card-elevated">
            <div className="p-12 relative">
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {renderStepContent()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              onClick={currentStep === 0 ? onBack : prevStep}
              variant="outline"
              className="btn-secondary"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Zurück' : 'Vorheriger Schritt'}
            </Button>

            <div className="flex items-center space-x-3">
              {currentStepData.id !== 'result' && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || calculating || registering}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="font-medium">Berechne...</span>
                    </>
                  ) : registering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="font-medium">Registriere...</span>
                    </>
                  ) : currentStepData.id === 'experience' ? (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      <span className="font-medium">Berechnen</span>
                    </>
                  ) : currentStepData.id === 'registration' ? (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">Registrieren</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Weiter</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
