import React from 'react';
import { Layout } from './Layout';
import { EnhancedMicrodoseWizard } from './EnhancedMicrodoseWizard';

/**
 * Test component for the enhanced microdose wizard
 * This component demonstrates the new wizard features
 */
export const WizardTest: React.FC = () => {
  const handleComplete = (data: any) => {
    console.log('Wizard completed with data:', data);
    alert('Wizard abgeschlossen! Daten in der Konsole.');
  };

  const handleBack = () => {
    console.log('Wizard cancelled');
    alert('Wizard abgebrochen!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-soft-white via-white to-turquoise-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Test Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-charcoal mb-4">
                Enhanced Microdose Wizard Test
              </h1>
              <p className="text-slate-gray text-lg max-w-2xl mx-auto">
                Testen Sie den neuen mehrstufigen Wizard mit verbesserter Mobile-Erfahrung
              </p>
            </div>

            {/* Feature Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
                <h2 className="text-xl font-semibold text-charcoal mb-4">
                  ✨ Neue Features
                </h2>
                <ul className="space-y-2 text-slate-gray">
                  <li>✅ 5-stufiger Wizard mit klarer Navigation</li>
                  <li>✅ Mobile-optimierte Progress Bar</li>
                  <li>✅ Echtzeit-Validierung mit Fehler-Feedback</li>
                  <li>✅ Keyboard Navigation (Pfeiltasten, Escape)</li>
                  <li>✅ Touch-optimierte Buttons und Layouts</li>
                  <li>✅ Responsive Design für alle Geräte</li>
                  <li>✅ Accessibility-Verbesserungen</li>
                  <li>✅ Smooth Animationen und Übergänge</li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
                <h2 className="text-xl font-semibold text-charcoal mb-4">
                  📱 Mobile Features
                </h2>
                <ul className="space-y-2 text-slate-gray">
                  <li>• Touch-optimierte Button-Größen (44px)</li>
                  <li>• Mobile Progress Toggle</li>
                  <li>• Responsive Grid-Layouts</li>
                  <li>• Swipe-freundliche Navigation</li>
                  <li>• Optimierte Schriftgrößen</li>
                  <li>• Vollbild-Mobile-Ansicht</li>
                  <li>• Touch-Feedback-Animationen</li>
                  <li>• Mobile-spezifische Validierung</li>
                </ul>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40 mb-8">
              <h2 className="text-xl font-semibold text-charcoal mb-4">
                🧪 Test-Anweisungen
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-charcoal mb-3">Desktop Testing:</h3>
                  <ul className="space-y-2 text-sm text-slate-gray">
                    <li>• Testen Sie die Keyboard-Navigation (Pfeiltasten)</li>
                    <li>• Überprüfen Sie die Hover-Effekte</li>
                    <li>• Testen Sie die Validierung</li>
                    <li>• Überprüfen Sie die Progress Bar</li>
                    <li>• Testen Sie die Schritt-Navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-3">Mobile Testing:</h3>
                  <ul className="space-y-2 text-sm text-slate-gray">
                    <li>• Resize Browser auf Mobile-Größe</li>
                    <li>• Testen Sie Touch-Interaktionen</li>
                    <li>• Überprüfen Sie Mobile Progress Toggle</li>
                    <li>• Testen Sie responsive Layouts</li>
                    <li>• Überprüfen Sie Touch-Button-Größen</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Wizard Component */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
              <EnhancedMicrodoseWizard 
                onComplete={handleComplete}
                onBack={handleBack}
              />
            </div>

            {/* Technical Details */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
              <h2 className="text-xl font-semibold text-charcoal mb-4">
                🔧 Technische Details
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-medium text-charcoal mb-2">Validierung:</h3>
                  <ul className="space-y-1 text-slate-gray">
                    <li>• Echtzeit-Validierung</li>
                    <li>• Schritt-spezifische Regeln</li>
                    <li>• Fehler-Feedback</li>
                    <li>• Visual Error States</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-2">Navigation:</h3>
                  <ul className="space-y-1 text-slate-gray">
                    <li>• Keyboard Support</li>
                    <li>• Touch Navigation</li>
                    <li>• Step Jumping</li>
                    <li>• Auto-scroll</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-2">Performance:</h3>
                  <ul className="space-y-1 text-slate-gray">
                    <li>• Hardware-Beschleunigung</li>
                    <li>• Smooth Animationen</li>
                    <li>• Optimierte Renders</li>
                    <li>• Memory Management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WizardTest;



