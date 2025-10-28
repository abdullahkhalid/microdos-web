import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ElegantMicrodoseCalculator } from './ElegantMicrodoseCalculator';
import { apiClient } from '../lib/api';

interface ExtendedSignupFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

type SignupStep = 'microdose' | 'credentials';

export const ExtendedSignupForm: React.FC<ExtendedSignupFormProps> = ({
  onSuccess,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('microdose');
  const [microdoseData, setMicrodoseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleMicrodoseComplete = (data: any) => {
    setMicrodoseData(data);
    setCurrentStep('credentials');
  };

  const handleCredentialsChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      alert('Passwörter stimmen nicht überein.');
      return;
    }

    if (credentials.password.length < 10) {
      alert('Passwort muss mindestens 10 Zeichen lang sein.');
      return;
    }

    setLoading(true);
    try {
      // First, create the user account
      const signupResponse = await apiClient.signup({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      });

      if (signupResponse.user) {
        // Then save the microdose profile
        try {
          await fetch(
            'https://microdos-web.vercel.app/api/microdose/save-profile',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                gender: microdoseData.gender,
                weight: parseFloat(microdoseData.weight),
                substance: microdoseData.substance,
                intakeForm: microdoseData.intakeForm,
                sensitivity: parseFloat(microdoseData.sensitivity),
                goal: microdoseData.goal,
                experience: microdoseData.experience || undefined,
                currentMedication: microdoseData.currentMedication || undefined,
              }),
            }
          );
        } catch (profileError) {
          console.error('Error saving microdose profile:', profileError);
          // Continue anyway - user account was created successfully
        }

        onSuccess();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(
        'Registrierung fehlgeschlagen: ' +
          (error.message || 'Unbekannter Fehler')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMicrodose = () => {
    setCurrentStep('microdose');
  };

  if (currentStep === 'microdose') {
    return (
      <ElegantMicrodoseCalculator
        onComplete={handleMicrodoseComplete}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Konto erstellen</CardTitle>
          <p className="text-sm text-gray-600">
            Erstellen Sie Ihr Konto mit E-Mail und Passwort.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={credentials.name}
                onChange={e => handleCredentialsChange('name', e.target.value)}
                placeholder="Ihr vollständiger Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={e => handleCredentialsChange('email', e.target.value)}
                placeholder="ihre@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort *</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={e =>
                  handleCredentialsChange('password', e.target.value)
                }
                placeholder="Mindestens 10 Zeichen"
                required
                minLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={credentials.confirmPassword}
                onChange={e =>
                  handleCredentialsChange('confirmPassword', e.target.value)
                }
                placeholder="Passwort wiederholen"
                required
              />
            </div>

            {/* Microdose Summary */}
            {microdoseData && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Ihre Mikrodosis-Berechnung:
                </h4>
                <div className="text-sm text-blue-700">
                  <p>
                    <strong>Substanz:</strong> {microdoseData.substance}
                  </p>
                  <p>
                    <strong>Empfohlene Dosis:</strong>{' '}
                    {microdoseData.calculatedDose} {microdoseData.doseUnit}
                  </p>
                  <p>
                    <strong>Ziel:</strong> {microdoseData.goal}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleBackToMicrodose}
                variant="outline"
                className="flex-1"
              >
                Zurück zur Berechnung
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Erstelle Konto...' : 'Konto erstellen'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
