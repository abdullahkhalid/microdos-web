import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Layout } from '../components/Layout';
import { 
  MapPin, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Flag,
  Leaf,
  Zap,
  Brain,
  Shield
} from 'lucide-react';

interface Country {
  id: string;
  name: string;
  flag: string;
  code: string;
}

interface Substance {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface LegalStatus {
  status: 'legal' | 'illegal' | 'restricted' | 'unknown';
  details: string;
  notes?: string;
  penalties?: string;
}

const countries: Country[] = [
  { id: 'de', name: 'Deutschland', flag: '🇩🇪', code: 'DE' },
  { id: 'at', name: 'Österreich', flag: '🇦🇹', code: 'AT' },
  { id: 'ch', name: 'Schweiz', flag: '🇨🇭', code: 'CH' },
  { id: 'dk', name: 'Dänemark', flag: '🇩🇰', code: 'DK' },
  { id: 'cz', name: 'Tschechien', flag: '🇨🇿', code: 'CZ' },
  { id: 'li', name: 'Liechtenstein', flag: '🇱🇮', code: 'LI' },
  { id: 'lu', name: 'Luxemburg', flag: '🇱🇺', code: 'LU' },
  { id: 'be', name: 'Belgien', flag: '🇧🇪', code: 'BE' },
];

const substances: Substance[] = [
  { 
    id: 'psilocybin', 
    name: 'Psilocybin', 
    icon: <Leaf className="h-6 w-6" />,
    description: 'Psilocybin-haltige Pilze o. Trüffel'
  },
  { 
    id: 'lsd', 
    name: 'LSD', 
    icon: <Zap className="h-6 w-6" />,
    description: 'Lysergsäurediethylamid'
  },
  { 
    id: 'ketamine', 
    name: 'Ketamin', 
    icon: <Brain className="h-6 w-6" />,
    description: 'Ketamin (Dissoziativum)'
  },
  { 
    id: 'amanita', 
    name: 'Amanita muscaria', 
    icon: <Shield className="h-6 w-6" />,
    description: 'Fliegenpilz (Muscimol/Ibotensäure)'
  },
];

// Legal status database based on current research
const legalStatusDatabase: Record<string, Record<string, LegalStatus>> = {
  de: {
    psilocybin: {
      status: 'legal',
      details: 'Legal zu bestellen aus den Niederlanden',
      notes: 'Bestellung aus den Niederlanden ist durch EU-Binnenmarkt legal',
      penalties: 'Keine Strafen bei Bestellung aus NL'
    },
    lsd: {
      status: 'illegal',
      details: 'Illegal nach BtMG Anlage I',
      notes: 'LSD ist als nicht verkehrsfähiges Betäubungsmittel eingestuft, aber 1S-LSD ist legal',
      penalties: 'Geldstrafe bis Freiheitsstrafe je nach Menge für LSD, keine Strafen für 1S-LSD'
    },
    ketamine: {
      status: 'restricted',
      details: 'Nur für medizinische Zwecke',
      notes: 'Ketamin ist als Betäubungsmittel verschreibungspflichtig',
      penalties: 'Illegaler Besitz: Geldstrafe bis Freiheitsstrafe'
    },
    amanita: {
      status: 'legal',
      details: 'Komplett legal',
      notes: 'Amanita muscaria ist nicht im BtMG aufgeführt und legal erhältlich',
      penalties: 'Keine Strafen'
    }
  },
  nl: {
    psilocybin: {
      status: 'illegal',
      details: 'Pilze illegal, Trüffel legal',
      notes: 'Psilocybin-Pilze sind illegal, aber Trüffel (Sclerotia) sind als Genussmittel legalisiert',
      penalties: 'Pilze: Geldstrafe, Trüffel: legal'
    },
    psilocybin_truffles: {
      status: 'legal',
      details: 'Legal als Genussmittel',
      notes: 'Magische Trüffel sind in den Niederlanden legal und werden mit 21% besteuert',
      penalties: 'Keine Strafen'
    },
    lsd: {
      status: 'illegal',
      details: 'Illegal nach Opiumwet',
      notes: 'LSD ist in den Niederlanden illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1cp_lsd': {
      status: 'illegal',
      details: 'Illegal nach Opiumwet',
      notes: '1cP-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1v_lsd': {
      status: 'illegal',
      details: 'Illegal nach Opiumwet',
      notes: '1V-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1d_lsd': {
      status: 'illegal',
      details: 'Illegal nach Opiumwet',
      notes: '1D-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    ketamine: {
      status: 'restricted',
      details: 'Nur für medizinische Zwecke',
      notes: 'Ketamin ist verschreibungspflichtig',
      penalties: 'Illegaler Besitz: Geldstrafe bis Freiheitsstrafe'
    },
    amanita: {
      status: 'legal',
      details: 'Legal',
      notes: 'Amanita muscaria ist in den Niederlanden legal',
      penalties: 'Keine Strafen'
    }
  },
  ch: {
    psilocybin: {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: 'Psilocybin ist in der Schweiz illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    psilocybin_truffles: {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: 'Psilocybin-haltige Trüffel sind in der Schweiz illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    lsd: {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: 'LSD ist in der Schweiz illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1cp_lsd': {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: '1cP-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1v_lsd': {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: '1V-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1d_lsd': {
      status: 'illegal',
      details: 'Illegal nach BetmG',
      notes: '1D-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    ketamine: {
      status: 'restricted',
      details: 'Nur für medizinische Zwecke',
      notes: 'Ketamin ist verschreibungspflichtig',
      penalties: 'Illegaler Besitz: Geldstrafe bis Freiheitsstrafe'
    },
    amanita: {
      status: 'legal',
      details: 'Legal',
      notes: 'Amanita muscaria ist in der Schweiz legal',
      penalties: 'Keine Strafen'
    }
  },
  at: {
    psilocybin: {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: 'Psilocybin ist in Österreich illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    psilocybin_truffles: {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: 'Psilocybin-haltige Trüffel sind in Österreich illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    lsd: {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: 'LSD ist in Österreich illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1cp_lsd': {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: '1cP-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1v_lsd': {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: '1V-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    '1d_lsd': {
      status: 'illegal',
      details: 'Illegal nach SMG',
      notes: '1D-LSD ist als LSD-Analog illegal',
      penalties: 'Geldstrafe bis Freiheitsstrafe'
    },
    ketamine: {
      status: 'restricted',
      details: 'Nur für medizinische Zwecke',
      notes: 'Ketamin ist verschreibungspflichtig',
      penalties: 'Illegaler Besitz: Geldstrafe bis Freiheitsstrafe'
    },
    amanita: {
      status: 'legal',
      details: 'Legal',
      notes: 'Amanita muscaria ist in Österreich legal',
      penalties: 'Keine Strafen'
    }
  }
};

export const LegalStatusPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedSubstance, setSelectedSubstance] = useState<string>('');
  const [result, setResult] = useState<LegalStatus | null>(null);

  const handleCheck = () => {
    if (!selectedCountry || !selectedSubstance) return;
    
    const countryData = legalStatusDatabase[selectedCountry];
    if (countryData && countryData[selectedSubstance]) {
      setResult(countryData[selectedSubstance]);
    } else {
      setResult({
        status: 'unknown',
        details: 'Keine Daten verfügbar',
        notes: 'Für diese Kombination sind keine aktuellen Informationen verfügbar'
      });
    }
  };

  const getStatusForCell = (countryId: string, substanceId: string) => {
    const countryData = legalStatusDatabase[countryId];
    if (countryData && countryData[substanceId]) {
      return countryData[substanceId];
    }
    return { status: 'unknown', details: 'Keine Daten' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'legal':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'illegal':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'restricted':
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      default:
        return <Info className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'legal':
        return 'border-green-200 bg-green-50';
      case 'illegal':
        return 'border-red-200 bg-red-50';
      case 'restricted':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'legal':
        return 'Legal';
      case 'illegal':
        return 'Illegal';
      case 'restricted':
        return 'Eingeschränkt';
      default:
        return 'Unbekannt';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-200/50 shadow-sm mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-700 font-semibold text-lg">Rechtsstatus-Checker</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Legalitäts-Checker
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Überprüfen Sie die aktuellen Rechtsstatus von der <b>Bestellung</b> von psychedelischen Substanzen in verschiedenen Ländern
            </p>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <div className="space-y-8">
                {/* Country Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-sage-600" />
                    <h3 className="text-2xl font-bold text-slate-900">Land auswählen</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        onClick={() => setSelectedCountry(country.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          selectedCountry === country.id
                            ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                            : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{country.flag}</div>
                          <div className="text-sm font-semibold">{country.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Substance Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Leaf className="h-6 w-6 text-sage-600" />
                    <h3 className="text-2xl font-bold text-slate-900">Substanz auswählen</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {substances.map((substance) => (
                      <button
                        key={substance.id}
                        onClick={() => setSelectedSubstance(substance.id)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                          selectedSubstance === substance.id
                            ? 'border-sage-500 bg-gradient-to-br from-sage-50 to-sage-100 text-sage-700 shadow-lg shadow-sage-200/50'
                            : 'border-slate-200 hover:border-sage-300 text-slate-600 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${
                            selectedSubstance === substance.id ? 'bg-sage-100' : 'bg-slate-100'
                          }`}>
                            {substance.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{substance.name}</div>
                            <div className="text-sm opacity-75 mt-1">{substance.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check Button */}
                <div className="text-center">
                  <Button
                    onClick={handleCheck}
                    disabled={!selectedCountry || !selectedSubstance}
                    className="rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <Scale className="h-5 w-5 mr-2" />
                    Rechtsstatus prüfen
                  </Button>
                </div>

                 {/* Result */}
                 {result && (
                   <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                     {selectedSubstance === 'lsd' ? (
                       /* Special LSD Display with 1S-LSD and LSD */
                       <div className="space-y-4">
                         {/* 1S-LSD - Legal */}
                         <Card className="border-2 border-green-200 bg-green-50">
                           <CardContent className="p-6">
                             <div className="flex items-start space-x-4">
                               <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                               <div className="flex-1">
                                 <div className="flex items-center space-x-3 mb-3">
                                   <h4 className="text-xl font-bold text-green-800">
                                     1S-LSD ist legal
                                   </h4>
                                   <div className="flex items-center space-x-2 text-green-600">
                                     <Flag className="h-4 w-4" />
                                     <span className="text-sm">
                                       {countries.find(c => c.id === selectedCountry)?.flag} {countries.find(c => c.id === selectedCountry)?.name}
                                     </span>
                                   </div>
                                 </div>
                                 
                                 <div className="space-y-3">
                                   <div>
                                     <h5 className="font-semibold text-green-800 mb-2">Was ist 1S-LSD?</h5>
                                     <p className="text-green-700 text-sm leading-relaxed">
                                       1S-LSD ist ein LSD-Analog, das strukturell sehr ähnlich zu LSD ist, aber eine andere chemische Formel hat. 
                                       Es ist in vielen Ländern legal, da es nicht explizit in den Betäubungsmittelgesetzen aufgeführt ist.
                                     </p>
                                   </div>
                                   
                                   <div>
                                     <h5 className="font-semibold text-green-800 mb-2">Rechtlicher Status:</h5>
                                     <p className="text-green-700 text-sm">
                                       Legal - 1S-LSD ist nicht in den Betäubungsmittelgesetzen aufgeführt
                                     </p>
                                   </div>
                                   
                                   <div>
                                     <h5 className="font-semibold text-green-800 mb-2">Wichtiger Hinweis:</h5>
                                     <p className="text-green-700 text-sm">
                                       Trotz der Legalität sollten Sie sich über die aktuellen Gesetze in Ihrem Land informieren, 
                                       da sich die Rechtslage schnell ändern kann.
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </CardContent>
                         </Card>

                         {/* LSD - Illegal */}
                         <Card className="border-2 border-red-200 bg-red-50">
                           <CardContent className="p-6">
                             <div className="flex items-start space-x-4">
                               <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                               <div className="flex-1">
                                 <div className="flex items-center space-x-3 mb-3">
                                   <h4 className="text-xl font-bold text-red-800">
                                     LSD ist illegal
                                   </h4>
                                   <div className="flex items-center space-x-2 text-red-600">
                                     <Flag className="h-4 w-4" />
                                     <span className="text-sm">
                                       {countries.find(c => c.id === selectedCountry)?.flag} {countries.find(c => c.id === selectedCountry)?.name}
                                     </span>
                                   </div>
                                 </div>
                                 
                                 <div className="space-y-3">
                                   <div>
                                     <h5 className="font-semibold text-red-800 mb-2">Rechtlicher Status:</h5>
                                     <p className="text-red-700 text-sm">
                                       Illegal - LSD ist in den Betäubungsmittelgesetzen als illegale Substanz aufgeführt
                                     </p>
                                   </div>
                                   
                                   <div>
                                     <h5 className="font-semibold text-red-800 mb-2">Strafen:</h5>
                                     <p className="text-red-700 text-sm">
                                       {result.penalties || 'Geldstrafe bis Freiheitsstrafe je nach Menge und Umständen'}
                                     </p>
                                   </div>
                                   
                                   <div>
                                     <h5 className="font-semibold text-red-800 mb-2">Hinweise:</h5>
                                     <p className="text-red-700 text-sm">
                                       Der Besitz, Handel und Konsum von LSD ist strafbar. Beachten Sie die geltenden Gesetze in Ihrem Land.
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </CardContent>
                         </Card>
                       </div>
                     ) : (
                       /* Standard Display for other substances */
                       <Card className={`border-2 ${getStatusColor(result.status)}`}>
                         <CardContent className="p-8">
                           <div className="flex items-start space-x-6">
                             {getStatusIcon(result.status)}
                             <div className="flex-1">
                               <div className="flex items-center space-x-3 mb-4">
                                 <h4 className="text-2xl font-bold text-slate-900">
                                   {getStatusText(result.status)}
                                 </h4>
                                 {selectedCountry && selectedSubstance && (
                                   <div className="flex items-center space-x-2 text-slate-600">
                                     <Flag className="h-4 w-4" />
                                     <span className="text-sm">
                                       {countries.find(c => c.id === selectedCountry)?.flag} {countries.find(c => c.id === selectedCountry)?.name}
                                     </span>
                                   </div>
                                 )}
                               </div>
                               
                               <div className="space-y-4">
                                 <div>
                                   <h5 className="font-semibold text-slate-800 mb-2">Details:</h5>
                                   <p className="text-slate-700">{result.details}</p>
                                 </div>
                                 
                                 {result.notes && (
                                   <div>
                                     <h5 className="font-semibold text-slate-800 mb-2">Hinweise:</h5>
                                     <p className="text-slate-700">{result.notes}</p>
                                   </div>
                                 )}
                                 
                                 {result.penalties && (
                                   <div>
                                     <h5 className="font-semibold text-slate-800 mb-2">Strafen:</h5>
                                     <p className="text-slate-700">{result.penalties}</p>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     )}
                   </div>
                 )}

                {/* Disclaimer */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Wichtiger Hinweis</h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        Diese Informationen dienen nur zu Bildungszwecken und basieren auf öffentlich verfügbaren Daten. 
                        Rechtsvorschriften können sich ändern. Konsultieren Sie immer einen Anwalt für rechtliche Beratung. 
                        Wir übernehmen keine Verantwortung für die Aktualität oder Vollständigkeit der Informationen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
