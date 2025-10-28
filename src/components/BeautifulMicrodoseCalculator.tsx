import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';
import {
  GenderIcons,
  SubstanceIcons,
  IntakeFormIcons,
  GoalIcons,
  ExperienceIcons,
  SensitivityIcon,
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

interface BeautifulMicrodoseCalculatorProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

type Step =
  | 'gender'
  | 'weight'
  | 'substance'
  | 'intakeForm'
  | 'sensitivity'
  | 'goal'
  | 'experience'
  | 'result';

const STEPS: { id: Step; title: string; icon: React.ReactNode }[] = [
  {
    id: 'gender',
    title: 'Geschlecht',
    icon: <GenderIcons.male className="w-5 h-5" />,
  },
  { id: 'weight', title: 'Gewicht', icon: <Weight className="w-5 h-5" /> },
  {
    id: 'substance',
    title: 'Substanz',
    icon: <SubstanceIcons.psilocybin className="w-5 h-5" />,
  },
  {
    id: 'intakeForm',
    title: 'Einnahmeform',
    icon: <IntakeFormIcons.dried_mushrooms className="w-5 h-5" />,
  },
  {
    id: 'sensitivity',
    title: 'Empfindlichkeit',
    icon: <Brain className="w-5 h-5" />,
  },
  { id: 'goal', title: 'Ziel', icon: <Target className="w-5 h-5" /> },
  { id: 'experience', title: 'Erfahrung', icon: <Award className="w-5 h-5" /> },
  { id: 'result', title: 'Ergebnis', icon: <Calculator className="w-5 h-5" /> },
];

export const BeautifulMicrodoseCalculator: React.FC<
  BeautifulMicrodoseCalculatorProps
> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<MicrodoseCalculationResult | null>(null);

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

  useEffect(() => {
    fetchSubstances();
  }, []);

  const fetchSubstances = async () => {
    try {
      const response = await fetch(
        'https://microdos-web.vercel.app/api/microdose/substances'
      );
      const data = await response.json();
      setSubstances(data.substances);
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
    const autoAdvanceFields = [
      'gender',
      'substance',
      'intakeForm',
      'goal',
      'experience',
    ];
    if (autoAdvanceFields.includes(field)) {
      setTimeout(() => {
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 500); // Small delay for animation
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
      const response = await apiClient.calculateMicrodose({
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        substance: formData.substance,
        intakeForm: formData.intakeForm,
        sensitivity: formData.sensitivity,
        goal: formData.goal,
        experience: formData.experience,
        currentMedication: formData.currentMedication,
      });

      if (response.success) {
        setResult(response.result);
        setCurrentStep(STEPS.length - 1);
      }
    } catch (error) {
      console.error('Error calculating microdose:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await apiClient.saveMicrodoseProfile({
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        substance: formData.substance,
        intakeForm: formData.intakeForm,
        sensitivity: formData.sensitivity,
        goal: formData.goal,
        experience: formData.experience,
        currentMedication: formData.currentMedication,
      });

      if (response.success) {
        onComplete(response.profile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const currentStepData = STEPS[currentStep];
  const selectedSubstance = substances.find(s => s.id === formData.substance);

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'gender':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Wählen Sie Ihr Geschlecht
              </h3>
              <p className="text-gray-600">
                Dies hilft bei der personalisierten Berechnung
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'male',
                  label: 'Männlich',
                  icon: GenderIcons.male,
                  color: 'blue',
                },
                {
                  id: 'female',
                  label: 'Weiblich',
                  icon: GenderIcons.female,
                  color: 'pink',
                },
                {
                  id: 'other',
                  label: 'Andere',
                  icon: GenderIcons.other,
                  color: 'purple',
                },
              ].map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('gender', option.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.gender === option.id
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl ${
                          formData.gender === option.id
                            ? `bg-${option.color}-100`
                            : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">
                          {option.label}
                        </div>
                      </div>
                      {formData.gender === option.id && (
                        <Check className="w-6 h-6 text-green-500 ml-auto" />
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
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Ihr Körpergewicht</h3>
              <p className="text-gray-600">
                Geben Sie Ihr Gewicht in Kilogramm ein
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Weight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  min="30"
                  max="200"
                  value={formData.weight}
                  onChange={e => handleInputChange('weight', e.target.value)}
                  placeholder="z.B. 70"
                  className="pl-12 text-center text-xl py-4 rounded-xl border-2"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  kg
                </span>
              </div>
            </div>
          </div>
        );

      case 'substance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Wählen Sie die Substanz
              </h3>
              <p className="text-gray-600">
                Für welche Substanz möchten Sie eine Mikrodosis berechnen?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {substances.map(substance => {
                const IconComponent =
                  SubstanceIcons[substance.id as keyof typeof SubstanceIcons];
                return (
                  <button
                    key={substance.id}
                    onClick={() => handleInputChange('substance', substance.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.substance === substance.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl ${
                          formData.substance === substance.id
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-lg">
                          {substance.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {substance.description}
                        </div>
                      </div>
                      {formData.substance === substance.id && (
                        <Check className="w-6 h-6 text-green-500" />
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
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Einnahmeform</h3>
              <p className="text-gray-600">
                In welcher Form möchten Sie die Substanz einnehmen?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {selectedSubstance?.intakeForms.map(form => {
                const IconComponent =
                  IntakeFormIcons[form.id as keyof typeof IntakeFormIcons];
                return (
                  <button
                    key={form.id}
                    onClick={() => handleInputChange('intakeForm', form.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.intakeForm === form.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.intakeForm === form.id
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="font-medium">{form.name}</div>
                      {formData.intakeForm === form.id && (
                        <Check className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'sensitivity':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Empfindlichkeit</h3>
              <p className="text-gray-600">
                Wie empfindlich reagieren Sie auf psychedelische Substanzen?
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <SensitivityIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">
                  Empfindlichkeit: {formData.sensitivity}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={formData.sensitivity}
                onChange={e =>
                  handleInputChange('sensitivity', parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Sehr empfindlich (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Wenig empfindlich (1.5x)</span>
              </div>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Ziel der Mikrodosierung
              </h3>
              <p className="text-gray-600">
                Was möchten Sie mit der Mikrodosierung erreichen?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'sub_perceptual',
                  label: 'Sub-perzeptuell',
                  description: '5% der Normaldosis - kaum spürbar',
                  icon: GoalIcons.sub_perceptual,
                  color: 'green',
                },
                {
                  id: 'standard',
                  label: 'Standard',
                  description: '10% der Normaldosis - typische Mikrodosis',
                  icon: GoalIcons.standard,
                  color: 'blue',
                },
                {
                  id: 'upper_microdose',
                  label: 'Obere Mikrodosis',
                  description: '20% der Normaldosis - leicht spürbar',
                  icon: GoalIcons.upper_microdose,
                  color: 'orange',
                },
              ].map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('goal', option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.goal === option.id
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.goal === option.id
                            ? `bg-${option.color}-100`
                            : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                      {formData.goal === option.id && (
                        <Check className="w-5 h-5 text-green-500" />
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
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Erfahrung (Optional)
              </h3>
              <p className="text-gray-600">
                Wie erfahren sind Sie mit psychedelischen Substanzen?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'beginner',
                  label: 'Anfänger',
                  description: 'Wenig bis keine Erfahrung',
                  icon: ExperienceIcons.beginner,
                  color: 'blue',
                },
                {
                  id: 'intermediate',
                  label: 'Fortgeschritten',
                  description: 'Einige Erfahrungen vorhanden',
                  icon: ExperienceIcons.intermediate,
                  color: 'green',
                },
                {
                  id: 'experienced',
                  label: 'Erfahren',
                  description: 'Viel Erfahrung mit Psychedelika',
                  icon: ExperienceIcons.experienced,
                  color: 'purple',
                },
              ].map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('experience', option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.experience === option.id
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          formData.experience === option.id
                            ? `bg-${option.color}-100`
                            : 'bg-gray-100'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                      {formData.experience === option.id && (
                        <Check className="w-5 h-5 text-green-500" />
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
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-blue-500 mx-auto" />
              <h3 className="text-xl font-semibold">
                Berechne Ihre Mikrodosis...
              </h3>
              <p className="text-gray-600">Dies kann einen Moment dauern</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Ihre Mikrodosis
              </h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {result.calculatedDose.toFixed(1)} {result.doseUnit}
              </div>
              <p className="text-gray-600">Basierend auf Ihren Angaben</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 className="font-semibold text-lg">Berechnungsdetails:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Basisdosis:</span>
                  <span className="font-medium ml-2">
                    {result.baseDose} {result.doseUnit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Gewichtsfaktor:</span>
                  <span className="font-medium ml-2">
                    {result.weightFactor.toFixed(2)}x
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Empfindlichkeit:</span>
                  <span className="font-medium ml-2">
                    {result.sensitivityFactor.toFixed(2)}x
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ziel-Faktor:</span>
                  <span className="font-medium ml-2">
                    {result.goalFactor.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-2">Erklärung:</h4>
              <p className="text-gray-700">{result.explanation}</p>
            </div>

            {result.recommendations.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-2">Empfehlungen:</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
        return true; // Always valid
      case 'goal':
        return formData.goal !== '';
      case 'experience':
        return true; // Optional
      case 'result':
        return result !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStepData.id === 'experience') {
      calculateMicrodose();
    } else if (currentStepData.id === 'result') {
      handleComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧮 Mikrodosierungs-Berechner
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Personalisierte Berechnung Ihrer optimalen Mikrodosis
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px] flex items-center justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onBack : prevStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentStep === 0 ? 'Zurück' : 'Vorheriger Schritt'}</span>
            </Button>

            <div className="text-sm text-gray-500">
              Schritt {currentStep + 1} von {STEPS.length}
            </div>

            {currentStepData.id !== 'result' && (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || calculating}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <span>
                  {calculating
                    ? 'Berechne...'
                    : currentStepData.id === 'experience'
                    ? 'Berechnen'
                    : 'Weiter'}
                </span>
                {!calculating && <ChevronRight className="w-4 h-4" />}
              </Button>
            )}

            {currentStepData.id === 'result' && (
              <Button
                onClick={handleComplete}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <span>Profil speichern</span>
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
