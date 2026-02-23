import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, Sun, Moon, Bell, Shield } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdminCheck';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Home', to: '/' as const },
    { label: 'About', to: '/about' as const },
    { label: 'Branches', to: '/branches' as const },
    { label: 'Subscription', to: '/subscription' as const },
    { label: 'Contact', to: '/contact' as const },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border/60 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img src="/assets/generated/logo.dim_200x200.png" alt="Logo" className="h-8 w-8" />
            </div>
            <span className="hidden font-display font-bold text-xl sm:inline-block text-primary">
              Diploma Study Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium transition-colors hover:text-primary relative group"
                activeProps={{ className: 'text-primary' }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex rounded-full">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          )}

          {isAuthenticated && isAdmin && (
            <Badge variant="default" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Badge>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {isAdmin ? 'A' : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/leaderboard' })}>
                  Leaderboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/reminders' })}>
                  Reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/quizzes' })}>
                  Daily Quizzes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/certificates' })}>
                  Certificates
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate({ to: '/admin/dashboard' })}
                      className="text-accent-foreground font-medium"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="hidden sm:inline-flex rounded-full px-6 shadow-warm"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-border/60 bg-background/95 backdrop-blur-lg">
          <nav className="container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && isAdmin && (
              <>
                <div className="border-t-2 border-border/60 pt-4">
                  <Badge variant="default" className="flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground w-fit">
                    <Shield className="h-3.5 w-3.5" />
                    Admin Access
                  </Badge>
                </div>
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </>
            )}
            <div className="flex items-center gap-3 pt-4 border-t-2 border-border/60">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="flex-1 rounded-full shadow-warm"
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
