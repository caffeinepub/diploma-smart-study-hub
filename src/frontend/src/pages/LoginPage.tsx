import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useAdminCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LogIn, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function LoginPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { isAdmin, isFetched } = useIsAdmin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('mouli10298@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (identity && isFetched) {
      if (isAdmin) {
        toast.success('Admin access granted', {
          description: 'Welcome back, Administrator!',
        });
        navigate({ to: '/admin/dashboard' });
      } else {
        navigate({ to: '/dashboard' });
      }
    }
  }, [identity, isAdmin, isFetched, navigate]);

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password presence
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Show that password authentication is not yet available
    setError('Password authentication is currently not available. The backend does not support secure password hashing yet. Please use Internet Identity to log in.');
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Log in to access your study materials and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Login Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login with Password
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Internet Identity Login */}
            <Button
              onClick={handleInternetIdentityLogin}
              disabled={isLoggingIn}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Logging in...' : 'Internet Identity'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Internet Computer
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
