import React from 'react';
import { Link } from 'react-router-dom';
import { UserCountBadge } from './UserCountBadge';
import TopReviews from './TopReviews';
import { ArrowRight } from 'lucide-react';

export const ElegantLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50">
      {/* Minimalist Top Navigation */}
      <nav className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-xl">🧠</span>
            </div>
            <span className="text-xl font-soft font-semibold text-slate-700">
              Microdos.in
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/legal-status">
              <span className="text-slate-600 hover:text-calm-lilac-600 font-soft text-sm transition-colors">
                Rechtsstatus
              </span>
            </Link>
            <Link to="/login">
              <span className="text-slate-600 hover:text-calm-lilac-600 font-soft text-sm transition-colors">
                Anmelden
              </span>
            </Link>
            <Link to="/signup">
              <div className="bg-gradient-to-r from-calm-turquoise-100 to-calm-lilac-100 hover:from-calm-turquoise-200 hover:to-calm-lilac-200 text-slate-700 rounded-full px-6 py-2 shadow-sm hover:shadow-md transition-all duration-300">
                <span className="font-soft text-sm font-medium">
                  Registrieren
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Rounded Frame */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Rounded Frame Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Hero Image with Pastel Background */}
            <div className="relative h-[80vh] w-full">
              <img 
                src="/images/presentation.jpg"
                alt="Professional speaker on stage presenting"
                className="w-full h-full object-cover"
              />
                            
              {/* Subtle overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Side - Main Content (8 columns) */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Main Title */}
                      <div className="space-y-4">
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-soft font-light leading-tight text-white">
                          Bring dein Leben auf das nächste Level – mit klarerem Fokus, mehr Kreativität & spürbar besserer Stimmung durch
                          <span className="block bg-gradient-to-r from-calm-turquoise-300 via-calm-lilac-300 to-calm-yellow-300 bg-clip-text text-transparent font-medium mt-2">
                            sichere & personalisierte Mikrodosierung
                          </span>
                        </h1>
                      </div>

                      {/* Social Proof and CTA Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Social Proof Badge - Dynamic User Count */}
                        <UserCountBadge />

                        {/* CTA Button */}
                        <Link to="/signup">
                          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-calm-turquoise-100 to-calm-lilac-100 hover:from-calm-turquoise-200 hover:to-calm-lilac-200 text-slate-700 rounded-2xl px-8 py-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center">
                              <span className="text-slate-600 text-lg">🧠</span>
                            </div>
                            <div className="text-left">
                              <div className="font-soft font-semibold text-lg">
                                Persönliche Mikrodosierung berechnen
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-slate-600" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Right Side - Floating Elements (4 columns) */}
                    <div className="lg:col-span-4 relative h-96 lg:h-auto">
                      {/* Top Left - Sparkle Icon */}
                      <div className="absolute top-8 left-0 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30">
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 96% Badge - Above Video */}
              <div className="absolute bottom-48 right-8">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                  <div className="text-center">
                    <div className="text-5xl font-soft font-bold bg-gradient-to-r from-calm-turquoise-300 to-calm-lilac-300 bg-clip-text text-transparent">
                      96%
                    </div>
                    <div className="text-white font-soft font-semibold text-sm uppercase tracking-wide">
                      Zufriedene Kunden
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Frame - Bottom Right Corner (no spacing) */}
              <div className="absolute bottom-0 right-0">
                <div className="relative w-64 h-40 bg-gradient-to-br from-calm-turquoise-50 to-calm-lilac-50 rounded-tl-2xl shadow-lg overflow-hidden">
                  {/* Video Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-calm-turquoise-100/30 to-calm-lilac-100/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎥</div>
                      <div className="text-xs text-slate-600 font-soft">Video Preview</div>
                    </div>
                  </div>
                  
                  {/* Play Button in Video Frame */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/50">
                      <div className="w-0 h-0 border-l-[8px] border-l-calm-lilac-500 border-y-[6px] border-y-transparent ml-1 group-hover:border-l-calm-turquoise-500 transition-colors"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Soft Corners */}
      <section className="px-6 py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-soft font-light text-slate-800 mb-4">
              Why Choose Microdos.in?
            </h2>
            <p className="text-slate-600 font-soft text-lg max-w-2xl mx-auto">
              Wissenschaftlich fundierte Berechnungen für eine sichere und effektive Mikrodosierung
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Wissenschaftlich fundiert',
                description: 'Basierend auf aktuellen Studien und pharmakologischen Erkenntnissen',
                color: 'from-calm-turquoise-100 to-calm-lilac-100',
                icon: '🧠'
              },
              {
                title: 'Personalisierte Berechnung',
                description: 'Berücksichtigt Gewicht, Empfindlichkeit und individuelle Ziele',
                color: 'from-calm-lilac-100 to-calm-yellow-100',
                icon: '⚖️'
              },
              {
                title: 'Sicherheit im Fokus',
                description: 'Konservative Dosierungen mit umfassenden Sicherheitsempfehlungen',
                color: 'from-calm-yellow-100 to-calm-peach-100',
                icon: '🛡️'
              },
              {
                title: 'Individuelle Anpassung',
                description: 'Berücksichtigt Erfahrung, Medikamente und persönliche Faktoren',
                color: 'from-calm-peach-100 to-calm-turquoise-100',
                icon: '💖'
              },
              {
                title: 'Protokoll & Tracking',
                description: 'Verfolgen Sie Ihre Erfahrungen und passen Sie die Dosierung an',
                color: 'from-calm-turquoise-100 to-calm-lilac-100',
                icon: '📅'
              },
              {
                title: 'Verschiedene Substanzen',
                description: 'Unterstützung für Psilocybin, LSD, Amanita und Ketamin',
                color: 'from-calm-lilac-100 to-calm-yellow-100',
                icon: '✨'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 hover:border-calm-lilac-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-soft font-semibold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-soft text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Reviews Section */}
      <TopReviews />

      {/* Final CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-soft font-light text-slate-800">
              Begin your journey to
              <span className="block bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                mental clarity
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-soft font-light leading-relaxed">
              Starten Sie noch heute mit einer wissenschaftlich fundierten, personalisierten Berechnung
            </p>
          </div>
          
          <div className="pt-8">
            <Link to="/signup">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white rounded-2xl px-10 py-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🚀</span>
                </div>
                <span className="font-soft font-semibold text-lg">
                  Jetzt starten
                </span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-lg">🧠</span>
            </div>
            <span className="text-lg font-soft font-medium text-slate-700">
              Microdos.in
            </span>
          </div>
          <p className="text-slate-500 font-soft text-sm">
            Wissenschaftlich fundierte Mikrodosierungs-Berechnungen
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 font-soft">
            <span>© 2024 Microdos.in</span>
            <span>•</span>
            <span>Datenschutz</span>
            <span>•</span>
            <span>Impressum</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
