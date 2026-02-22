import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, BookOpen, Sun, Moon, Bell } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/logo.dim_200x200.png" alt="Logo" className="h-10 w-10" />
            <span className="hidden font-bold text-lg sm:inline-block text-primary">
              Diploma Study Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              About
            </Link>
            <Link
              to="/branches"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              Branches
            </Link>
            <Link
              to="/subscription"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              Subscription
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/admin/dashboard' })}>
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleAuth} disabled={isLoggingIn} className="hidden sm:inline-flex">
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/branches"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Branches
            </Link>
            <Link
              to="/subscription"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Subscription
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button onClick={handleAuth} disabled={isLoggingIn} className="flex-1">
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
