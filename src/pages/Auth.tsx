import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/logo.png';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Email non valida' }).max(255, { message: 'Email troppo lunga' }),
  password: z.string().min(6, { message: 'Password deve avere almeno 6 caratteri' }).max(100, { message: 'Password troppo lunga' })
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Errore',
              description: 'Credenziali non valide. Controlla email e password.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Errore',
              description: error.message,
              variant: 'destructive'
            });
          }
        }
      } else {
        const { error } = await signUp(data.email, data.password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Errore',
              description: 'Questa email è già registrata. Prova ad accedere.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Errore',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Registrazione completata!',
            description: 'Account creato con successo. Effettua il login.',
          });
          setIsLogin(true);
          reset();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="OverTimeTracker" 
                className="h-20 w-auto drop-shadow-lg"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {isLogin ? 'Bentornato!' : 'Crea Account'}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                {isLogin 
                  ? 'Accedi per gestire le tue ore di straordinario' 
                  : 'Registrati per iniziare a tracciare i tuoi straordinari'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@esempio.com"
                    className="pl-10 h-12 bg-background border-border focus:border-primary"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-background border-border focus:border-primary"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Accesso...' : 'Registrazione...'}
                  </>
                ) : (
                  isLogin ? 'Accedi' : 'Registrati'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">oppure</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => {
                setIsLogin(!isLogin);
                reset();
              }}
            >
              {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>© 2025 OverTimeTracker</p>
        <p>App realizzata da <span className="font-semibold text-primary">GP</span></p>
      </footer>
    </div>
  );
};

export default Auth;
