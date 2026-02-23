import { Link } from '@tanstack/react-router';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'diploma-study-hub'
  );

  return (
    <footer className="border-t-2 border-border/60 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <img src="/assets/generated/logo.dim_200x200.png" alt="Logo" className="h-8 w-8" />
              </div>
              <span className="font-display font-bold text-xl text-primary">Diploma Study Hub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering diploma students with quality study materials and resources across all engineering branches.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/branches', label: 'Branches' },
                { to: '/subscription', label: 'Subscription' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/quizzes', label: 'Daily Quizzes' },
                { to: '/leaderboard', label: 'Leaderboard' },
                { to: '/certificates', label: 'Certificates' },
                { to: '/reminders', label: 'Study Reminders' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Connect With Us</h3>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: SiFacebook, href: '#' },
                { Icon: SiX, href: '#' },
                { Icon: SiInstagram, href: '#' },
                { Icon: SiLinkedin, href: '#' },
                { Icon: SiYoutube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Stay updated with the latest study materials and announcements
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Diploma Study Hub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
