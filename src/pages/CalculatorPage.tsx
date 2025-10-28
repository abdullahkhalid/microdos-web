import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ElegantMicrodoseCalculator } from '@/components/ElegantMicrodoseCalculator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function CalculatorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRecalculating, setIsRecalculating] = useState(false);

  const isRecalculation = searchParams.get('recalculate') === 'true';

  useEffect(() => {
    if (isRecalculation) {
      setIsRecalculating(true);
    }
  }, [isRecalculation]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiClient.saveMicrodoseProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['microdoseProfile'] });
      toast({
        title: 'Profil aktualisiert!',
        description: 'Ihr Mikrodosierungs-Profil wurde erfolgreich aktualisiert.',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Aktualisieren',
        description: error.response?.data?.message || 'Ein Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  const handleComplete = async (data: any) => {
    try {
      await updateProfileMutation.mutateAsync({
        gender: data.gender,
        weight: parseFloat(data.weight),
        substance: data.substance,
        intakeForm: data.intakeForm,
        sensitivity: parseFloat(data.sensitivity),
        goal: data.goal,
        experience: data.experience,
        currentMedication: data.currentMedication,
        calculatedDose: data.calculatedDose,
        doseUnit: data.doseUnit,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
          {isRecalculating && (
            <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-amber-600">⚠️</div>
                <div className="text-sm text-amber-800 font-soft">
                  <div className="font-semibold">Profil wird überschrieben</div>
                  <div>
                    Sie berechnen Ihre Mikrodosis neu. Das aktuelle Profil wird überschrieben.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <ElegantMicrodoseCalculator
            onComplete={handleComplete}
            onBack={handleBack}
          />
          </div>
        </div>
      </div>
    </Layout>
  );
}
