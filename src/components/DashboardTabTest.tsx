import React from 'react';
import { Layout } from './Layout';
import { DashboardTabNavigation } from './DashboardTabNavigation';

/**
 * Test component for dashboard tab navigation
 * This component demonstrates the mobile-optimized tab navigation
 */
export const DashboardTabTest: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Tab Navigation */}
          <DashboardTabNavigation />

          {/* Test Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-charcoal mb-6">
                Dashboard Tab Navigation Test
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-soft-white/50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">
                    Mobile Features
                  </h2>
                  <ul className="space-y-2 text-slate-gray">
                    <li>✅ 2-Zeilen-Layout für kleine Bildschirme</li>
                    <li>✅ Horizontales Scrolling mit Scroll-Buttons</li>
                    <li>✅ Touch-optimierte Button-Größen</li>
                    <li>✅ Smooth Scroll-Animationen</li>
                    <li>✅ Auto-Scroll zum aktiven Tab</li>
                    <li>✅ Scroll-Indikatoren</li>
                    <li>✅ Responsive Breakpoints</li>
                    <li>✅ Accessibility-Unterstützung</li>
                  </ul>
                </div>

                <div className="bg-soft-white/50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-4">
                    Desktop Features
                  </h2>
                  <ul className="space-y-2 text-slate-gray">
                    <li>✅ Horizontales Layout in einer Zeile</li>
                    <li>✅ Hover-Effekte und Animationen</li>
                    <li>✅ Gradient-Hintergründe</li>
                    <li>✅ Responsive Icon-Größen</li>
                    <li>✅ Keyboard Navigation</li>
                    <li>✅ Focus Management</li>
                    <li>✅ High Contrast Support</li>
                    <li>✅ Reduced Motion Support</li>
                  </ul>
                </div>
              </div>

              <div className="bg-soft-white/50 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">
                  Responsive Breakpoints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-charcoal mb-2">Mobile (< 480px)</h3>
                    <ul className="space-y-1 text-slate-gray">
                      <li>• 2-Zeilen-Layout</li>
                      <li>• 120px Tab-Breite</li>
                      <li>• Kleine Icons & Text</li>
                      <li>• Touch-optimiert</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-2">Mobile (481-767px)</h3>
                    <ul className="space-y-1 text-slate-gray">
                      <li>• 2-Zeilen-Layout</li>
                      <li>• 140px Tab-Breite</li>
                      <li>• Horizontales Scrolling</li>
                      <li>• Scroll-Buttons</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-2">Desktop (≥ 768px)</h3>
                    <ul className="space-y-1 text-slate-gray">
                      <li>• Ein-Zeilen-Layout</li>
                      <li>• Flexible Tab-Breiten</li>
                      <li>• Hover-Effekte</li>
                      <li>• Standard-Größen</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-soft-white/50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">
                  Test Instructions
                </h2>
                <div className="space-y-3 text-slate-gray">
                  <p><strong>Mobile Testing:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Resize browser to mobile width (< 768px)</li>
                    <li>• Test 2-row layout with 2 tabs per row</li>
                    <li>• Test horizontal scrolling with scroll buttons</li>
                    <li>• Test touch scrolling on mobile devices</li>
                    <li>• Test tab switching and active states</li>
                  </ul>
                  
                  <p className="mt-4"><strong>Desktop Testing:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Test single-row layout (≥ 768px)</li>
                    <li>• Test hover effects and animations</li>
                    <li>• Test keyboard navigation (Tab, Enter)</li>
                    <li>• Test focus management</li>
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

export default DashboardTabTest;
