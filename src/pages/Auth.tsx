import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const { user, loading, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Reset password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setShowResetPassword(true);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && !showResetPassword) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      toast({
        title: 'Errore di accesso',
        description: error.message === 'Invalid login credentials' 
          ? 'Email o password non corretti' 
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Accesso effettuato',
        description: 'Benvenuto in ExtraOre!',
      });
    }

    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: 'Errore',
        description: 'Le password non coincidono',
        variant: 'destructive',
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: 'Errore',
        description: 'La password deve essere di almeno 6 caratteri',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp(registerEmail, registerPassword);

    if (error) {
      toast({
        title: 'Errore di registrazione',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registrazione completata',
        description: 'Il tuo account è stato creato con successo!',
      });
    }

    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await resetPassword(forgotEmail);

    if (error) {
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Email inviata',
        description: 'Controlla la tua casella email per il link di recupero password.',
      });
      setShowForgotPassword(false);
      setForgotEmail('');
    }

    setIsSubmitting(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Errore',
        description: 'Le password non coincidono',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Errore',
        description: 'La password deve essere di almeno 6 caratteri',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await updatePassword(newPassword);

    if (error) {
      toast({
        title: 'Errore',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password aggiornata',
        description: 'La tua password è stata aggiornata con successo!',
      });
      setShowResetPassword(false);
      setNewPassword('');
      setConfirmNewPassword('');
    }

    setIsSubmitting(false);
  };

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 safe-area-inset">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold flex items-center gap-1">
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Extra
              </span>
              <span className="text-amber-500">
                Ore
              </span>
            </h1>
          </div>

          <Card className="border-border/50 shadow-xl bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Reimposta Password</CardTitle>
              <CardDescription>Inserisci la tua nuova password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nuova Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Conferma Password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aggiornamento...
                    </>
                  ) : (
                    'Aggiorna Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot Password Form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 safe-area-inset">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold flex items-center gap-1">
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Extra
              </span>
              <span className="text-amber-500">
                Ore
              </span>
            </h1>
          </div>

          <Card className="border-border/50 shadow-xl bg-card/95 backdrop-blur">
            <CardHeader>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForgotPassword(false)}
                className="w-fit -ml-2 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Torna al login
              </Button>
              <CardTitle>Recupera Password</CardTitle>
              <CardDescription>
                Inserisci la tua email per ricevere il link di recupero password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="nome@esempio.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    'Invia Link di Recupero'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 safe-area-inset">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-1">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Extra
            </span>
            <span className="text-amber-500">
              Ore
            </span>
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Gestisci le tue ore di straordinario
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-border/50 shadow-xl bg-card/95 backdrop-blur">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="text-sm">Accedi</TabsTrigger>
                <TabsTrigger value="register" className="text-sm">Registrati</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Login Tab */}
              <TabsContent value="login" className="mt-0 space-y-4">
                <CardDescription className="text-center">
                  Inserisci le tue credenziali per accedere
                </CardDescription>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nome@esempio.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accesso in corso...
                      </>
                    ) : (
                      'Accedi'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Password dimenticata?
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0 space-y-4">
                <CardDescription className="text-center">
                  Crea un nuovo account per iniziare
                </CardDescription>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nome@esempio.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Conferma Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrazione in corso...
                      </>
                    ) : (
                      'Registrati'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          App realizzata da <a href="https://gennaropaolillo.it" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">gennaropaolillo.it</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
