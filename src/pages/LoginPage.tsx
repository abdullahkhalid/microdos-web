import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Twitter, Eye, EyeOff, Leaf } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleTwitterLogin = () => {
    window.location.href = '/api/auth/twitter';
  };

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-calm-turquoise-50 via-calm-lilac-50 to-calm-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-soft font-semibold bg-gradient-to-r from-calm-turquoise-600 to-calm-lilac-600 bg-clip-text text-transparent">Microdos.in</span>
            </Link>
          </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-soft font-light text-slate-800">Willkommen zurück</CardTitle>
            <CardDescription className="text-slate-600 font-soft">
              Melden Sie sich an, um fortzufahren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Twitter Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={handleTwitterLogin}
              disabled={isLoading}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Mit Twitter fortfahren
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
                <Label htmlFor="email" className="font-soft text-slate-700">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ihre E-Mail-Adresse eingeben"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Ihr Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline font-soft"
                >
                  Passwort vergessen?
                </Link>
              </div>

              <Button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 hover:from-calm-turquoise-500 hover:to-calm-lilac-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" disabled={isLoading}>
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-600 font-soft">Noch kein Konto? </span>
              <Link to="/signup" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline font-medium font-soft">
                Registrieren
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-600 font-soft">
          Durch die Anmeldung stimmen Sie unseren{' '}
          <Link to="/terms" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline">
            Nutzungsbedingungen
          </Link>{' '}
          und der{' '}
          <Link to="/privacy" className="text-calm-turquoise-600 hover:text-calm-turquoise-700 hover:underline">
            Datenschutzerklärung
          </Link>{' '}
          zu
        </div>
        </div>
      </div>
    </Layout>
  );
}
