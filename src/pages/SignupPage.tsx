import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LeadMagnetCalculator } from '@/components/LeadMagnetCalculator';
import { Twitter, Eye, EyeOff, Check, X, Leaf } from 'lucide-react';

export function SignupPage() {
  const [useExtendedSignup, setUseExtendedSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordRequirements = [
    { text: 'Mindestens 10 Zeichen', met: formData.password.length >= 10 },
    { text: 'Enthält Großbuchstaben', met: /[A-Z]/.test(formData.password) },
    { text: 'Enthält Kleinbuchstaben', met: /[a-z]/.test(formData.password) },
    { text: 'Enthält Zahl oder Symbol', met: /[0-9!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.password === formData.confirmPassword && 
                     isPasswordValid && agreedToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    try {
      await signup(formData.email, formData.password, formData.name);
      toast({
        title: 'Account created!',
        description: 'Welcome to Microdos.in! Your account has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleTwitterSignup = () => {
    window.location.href = '/api/auth/twitter';
  };

  const handleLeadMagnetSuccess = (user: any, profile: any) => {
    toast({
      title: 'Account created!',
      description: 'Welcome to Microdos.in! Your account and microdose profile have been created successfully.',
    });
    navigate('/dashboard');
  };

  const handleBackToNormalSignup = () => {
    setUseExtendedSignup(false);
  };

  if (useExtendedSignup) {
    return (
      <LeadMagnetCalculator
        onSuccess={handleLeadMagnetSuccess}
        onBack={handleBackToNormalSignup}
      />
    );
  }

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-xl">🧠</span>
              </div>
              <span className="text-xl font-soft font-semibold text-slate-700">
                Microdos.in
              </span>
            </Link>
          </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-soft font-light text-slate-800">Konto erstellen</CardTitle>
            <CardDescription className="text-slate-600 font-soft">
              Beginnen Sie noch heute mit Microdos.in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Twitter Signup */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={handleTwitterSignup}
              disabled={isLoading}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Mit Twitter fortfahren
            </Button>

            {/* Extended Signup with Microdose Calculator */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-white/40 bg-gradient-to-r from-calm-turquoise-100 to-calm-lilac-100 hover:from-calm-turquoise-200 hover:to-calm-lilac-200 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setUseExtendedSignup(true)}
              disabled={isLoading}
            >
              🧮 Mit Mikrodosierungs-Berechner registrieren
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 backdrop-blur-sm px-2 text-slate-600 font-soft">
                  Oder mit E-Mail fortfahren
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-soft text-slate-700">Vollständiger Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ihren vollständigen Namen eingeben"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-soft text-slate-700">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ihre E-Mail-Adresse eingeben"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-soft text-slate-700">Passwort</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Passwort erstellen"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                    className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1 text-xs">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`font-soft ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-soft text-slate-700">Passwort bestätigen</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Passwort bestätigen"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    disabled={isLoading}
                    className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 font-soft">Passwörter stimmen nicht überein</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-gray-300"
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm font-soft text-slate-700">
                  Ich stimme den{' '}
                  <Link to="/terms" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline">
                    Nutzungsbedingungen
                  </Link>{' '}
                  und der{' '}
                  <Link to="/privacy" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  zu
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? 'Konto wird erstellt...' : 'Konto erstellen'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-600 font-soft">Bereits ein Konto? </span>
              <Link to="/login" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline font-medium font-soft">
                Anmelden
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Layout>
  );
}
