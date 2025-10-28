import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { apiClient } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Calculator, RefreshCw, AlertTriangle } from 'lucide-react';

interface MicrodoseProfile {
  id: string;
  userId: string;
  gender: string;
  weight: number;
  substance: string;
  intakeForm: string;
  sensitivity: number;
  goal: string;
  calculatedDose: number;
  doseUnit: string;
  experience?: string;
  currentMedication?: string;
  createdAt: string;
  updatedAt: string;
}

export const MicrodoseProfile: React.FC = () => {
  const [profile, setProfile] = useState<MicrodoseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMicrodoseProfile();
      if (response.success) {
        setProfile(response.profile);
      } else {
        setError('Profil nicht gefunden');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Fehler beim Laden des Profils');
    } finally {
      setLoading(false);
    }
  };

  const getSubstanceName = (substance: string) => {
    const names: { [key: string]: string } = {
      psilocybin: 'Psilocybin (Magic Mushrooms)',
      lsd: 'LSD',
      amanita: 'Amanita muscaria',
      ketamine: 'Ketamin',
    };
    return names[substance] || substance;
  };

  const getIntakeFormName = (intakeForm: string) => {
    const names: { [key: string]: string } = {
      dried_mushrooms: 'Getrocknete Pilze',
      fresh_mushrooms: 'Frische Pilze',
      truffles: 'Trüffel',
      pure_extract: 'Reines Extrakt',
      blotter: 'Filztabletten',
      liquid: 'Flüssig',
      capsules: 'Kapseln',
    };
    return names[intakeForm] || intakeForm;
  };

  const getGoalName = (goal: string) => {
    const names: { [key: string]: string } = {
      sub_perceptual: 'Sub-perzeptuell (5% der Normaldosis)',
      standard: 'Standard (10% der Normaldosis)',
      upper_microdose: 'Obere Mikrodosis (20% der Normaldosis)',
    };
    return names[goal] || goal;
  };

  const getExperienceName = (experience?: string) => {
    if (!experience) return 'Nicht angegeben';
    const names: { [key: string]: string } = {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      experienced: 'Erfahren',
    };
    return names[experience] || experience;
  };

  const handleRecalculateDose = async () => {
    if (!profile) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Möchten Sie Ihre Mikrodosis neu berechnen? Das aktuelle Profil wird überschrieben und Sie müssen alle Daten erneut eingeben.'
    );

    if (!confirmed) return;

    setRecalculating(true);
    try {
      // Navigate to the calculator with a flag to indicate this is a recalculation
      navigate('/calculator?recalculate=true');
    } catch (error) {
      console.error('Error navigating to calculator:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Öffnen des Rechners. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Lade Profil...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {error || 'Kein Mikrodosierungs-Profil gefunden'}
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => window.location.href = '/signup'}>
              Profil erstellen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ihr Mikrodosierungs-Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calculated Dose - Highlight */}
          <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {profile.calculatedDose} {profile.doseUnit}
            </div>
            <div className="text-lg text-blue-800 font-semibold">
              Empfohlene Mikrodosis
            </div>
            <div className="text-sm text-blue-600 mt-2">
              {getSubstanceName(profile.substance)} • {getIntakeFormName(profile.intakeForm)}
            </div>
          </div>

          {/* Recalculate Button */}
          <div className="text-center">
            <Button
              onClick={handleRecalculateDose}
              disabled={recalculating}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              {recalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Öffne Rechner...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Dosis neu berechnen
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Ihre aktuellen Daten werden überschrieben
            </p>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Geschlecht</label>
                <div className="text-lg">{profile.gender}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Körpergewicht</label>
                <div className="text-lg">{profile.weight} kg</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Substanz</label>
                <div className="text-lg">{getSubstanceName(profile.substance)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Einnahmeform</label>
                <div className="text-lg">{getIntakeFormName(profile.intakeForm)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Empfindlichkeit</label>
                <div className="text-lg">{profile.sensitivity}x</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ziel</label>
                <div className="text-lg">{getGoalName(profile.goal)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Erfahrung</label>
                <div className="text-lg">{getExperienceName(profile.experience)}</div>
              </div>
              {profile.currentMedication && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Aktuelle Medikamente</label>
                  <div className="text-lg">{profile.currentMedication}</div>
                </div>
              )}
            </div>
          </div>

          {/* Safety Information */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Wichtige Hinweise</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Beginnen Sie mit der Hälfte der berechneten Dosis für den ersten Test</li>
              <li>• Warten Sie mindestens 3-4 Stunden zwischen Einnahmen</li>
              <li>• Führen Sie ein Tagebuch über Ihre Erfahrungen</li>
              <li>• Konsultieren Sie einen Arzt bei gesundheitlichen Bedenken</li>
              <li>• Mikrodosierung sollte sub-perzeptuell bleiben</li>
            </ul>
          </div>

          {/* Recalculation Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <div className="font-semibold mb-1">Hinweis zur Neuberechnung</div>
                <div>
                  Wenn Sie Ihre Dosis neu berechnen, wird Ihr aktuelles Profil überschrieben. 
                  Alle bestehenden Protokolle bleiben erhalten, aber neue Protokolle verwenden 
                  die neu berechnete Dosis.
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-center">
            Letzte Aktualisierung: {new Date(profile.updatedAt).toLocaleDateString('de-DE')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

