import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, LogIn, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Welcome back!', { description: 'You are now logged in.' });
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error.message === 'User is already authenticated') {
        await clear();
        queryClient.clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed', { description: 'Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[oklch(0.22_0.09_255)] flex items-center justify-center mx-auto shadow-navy">
            <GraduationCap className="w-8 h-8 text-[oklch(0.75_0.18_74)]" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground">DiplomaHub</h1>
          <p className="text-muted-foreground text-sm">Smart Study Platform for Diploma Students</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-card border border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-heading text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your study materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-[oklch(0.22_0.09_255)] hover:bg-[oklch(0.28_0.10_255)] text-white font-semibold h-11"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login with Internet Identity
                </span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Secure & Decentralized</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/30">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your identity is secured by Internet Identity — a blockchain-based authentication system. No passwords needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          New to DiplomaHub?{' '}
          <button
            onClick={handleLogin}
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
