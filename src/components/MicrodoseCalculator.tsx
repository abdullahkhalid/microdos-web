import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiClient } from '../lib/api';

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

interface MicrodoseCalculatorProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export const MicrodoseCalculator: React.FC<MicrodoseCalculatorProps> = ({
  onComplete,
  onBack,
}) => {
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
      const response = await apiClient.healthCheck(); // Test API connection
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
    
    // Reset intake form when substance changes
    if (field === 'substance') {
      setFormData(prev => ({
        ...prev,
        substance: value,
        intakeForm: '',
      }));
    }
  };

  const calculateMicrodose = async () => {
    if (!formData.gender || !formData.weight || !formData.substance || 
        !formData.intakeForm || !formData.goal) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setCalculating(true);
    try {
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
      } else {
        alert('Fehler bei der Berechnung: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Error calculating microdose:', error);
      alert('Fehler bei der Berechnung. Bitte versuchen Sie es erneut.');
    } finally {
      setCalculating(false);
    }
  };

  const handleContinue = () => {
    if (!result) {
      alert('Bitte führen Sie zuerst eine Berechnung durch.');
      return;
    }

    onComplete({
      ...formData,
      calculatedDose: result.calculatedDose,
      doseUnit: result.doseUnit,
      calculationResult: result,
    });
  };

  const selectedSubstance = substances.find(s => s.id === formData.substance);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mikrodosierungs-Berechner</CardTitle>
          <p className="text-sm text-gray-600">
            Geben Sie Ihre Daten ein, um eine personalisierte Mikrodosis zu berechnen.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Geschlecht *</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Bitte wählen</option>
              <option value="male">Männlich</option>
              <option value="female">Weiblich</option>
              <option value="other">Andere</option>
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Körpergewicht (kg) *</Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="200"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="z.B. 70"
            />
          </div>

          {/* Substance */}
          <div className="space-y-2">
            <Label htmlFor="substance">Substanz *</Label>
            <select
              id="substance"
              value={formData.substance}
              onChange={(e) => handleInputChange('substance', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Bitte wählen</option>
              {substances.map((substance) => (
                <option key={substance.id} value={substance.id}>
                  {substance.name}
                </option>
              ))}
            </select>
          </div>

          {/* Intake Form */}
          {selectedSubstance && (
            <div className="space-y-2">
              <Label htmlFor="intakeForm">Einnahmeform *</Label>
              <select
                id="intakeForm"
                value={formData.intakeForm}
                onChange={(e) => handleInputChange('intakeForm', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Bitte wählen</option>
                {selectedSubstance.intakeForms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sensitivity */}
          <div className="space-y-2">
            <Label htmlFor="sensitivity">Empfindlichkeit *</Label>
            <select
              id="sensitivity"
              value={formData.sensitivity}
              onChange={(e) => handleInputChange('sensitivity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="0.5">Sehr empfindlich (0.5x)</option>
              <option value="0.8">Empfindlich (0.8x)</option>
              <option value="1.0">Normal (1.0x)</option>
              <option value="1.2">Weniger empfindlich (1.2x)</option>
              <option value="1.5">Wenig empfindlich (1.5x)</option>
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">Ziel der Mikrodosierung *</Label>
            <select
              id="goal"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Bitte wählen</option>
              <option value="sub_perceptual">Sub-perzeptuell (5% der Normaldosis)</option>
              <option value="standard">Standard (10% der Normaldosis)</option>
              <option value="upper_microdose">Obere Mikrodosis (20% der Normaldosis)</option>
            </select>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Erfahrung</Label>
            <select
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Bitte wählen</option>
              <option value="beginner">Anfänger</option>
              <option value="intermediate">Fortgeschritten</option>
              <option value="experienced">Erfahren</option>
            </select>
          </div>

          {/* Current Medication */}
          <div className="space-y-2">
            <Label htmlFor="currentMedication">Aktuelle Medikamente</Label>
            <Input
              id="currentMedication"
              value={formData.currentMedication}
              onChange={(e) => handleInputChange('currentMedication', e.target.value)}
              placeholder="z.B. SSRI, Antidepressiva..."
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={onBack} variant="outline">
              Zurück
            </Button>
            <Button 
              onClick={calculateMicrodose} 
              disabled={calculating}
              className="flex-1"
            >
              {calculating ? 'Berechne...' : 'Mikrodosis berechnen'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Berechnungsergebnis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {result.calculatedDose} {result.doseUnit}
              </div>
              <div className="text-sm text-gray-600">Empfohlene Mikrodosis</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Berechnung:</h4>
              <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {result.explanation}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Empfehlungen:</h4>
              <ul className="text-sm space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={handleContinue} className="w-full">
              Mit dieser Berechnung fortfahren
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
