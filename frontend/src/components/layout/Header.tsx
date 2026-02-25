import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  CreditCard,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Branches', path: '/branches', icon: <BookOpen className="w-4 h-4" />, auth: true },
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, auth: true },
    { label: 'Subscribe', path: '/subscription', icon: <CreditCard className="w-4 h-4" />, auth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[oklch(0.22_0.09_255)] shadow-navy">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[oklch(0.75_0.18_74)] flex items-center justify-center shadow-amber">
              <GraduationCap className="w-5 h-5 text-[oklch(0.15_0.03_240)]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-white leading-none">DiplomaHub</span>
              <p className="text-[10px] text-[oklch(0.75_0.18_74)] leading-none">Smart Study Platform</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate({ to: link.path })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className={isAuthenticated
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold'
              }
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : isAuthenticated ? (
                <span className="flex items-center gap-1.5"><LogOut className="w-3.5 h-3.5" />Logout</span>
              ) : (
                <span className="flex items-center gap-1.5"><LogIn className="w-3.5 h-3.5" />Login</span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[oklch(0.18_0.08_255)] animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <button
                  key={link.path}
                  onClick={() => { navigate({ to: link.path }); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10">
              <Button
                onClick={() => { handleAuth(); setMobileMenuOpen(false); }}
                disabled={isLoggingIn}
                className={`w-full ${isAuthenticated
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold'
                }`}
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
