import { GraduationCap, Heart, BookOpen, CreditCard, LayoutDashboard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'diplomahub');

  return (
    <footer className="bg-[oklch(0.16_0.07_255)] text-white/80 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.75_0.18_74)] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-[oklch(0.15_0.03_240)]" />
              </div>
              <span className="font-heading font-bold text-white text-lg">DiplomaHub</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your smart study companion for Diploma engineering. Access notes, videos, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Branches', path: '/branches' },
                { label: 'Dashboard', path: '/dashboard' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="text-sm text-white/60 hover:text-[oklch(0.75_0.18_74)] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Study Notes', icon: <BookOpen className="w-3 h-3" /> },
                { label: 'Video Lectures', icon: <LayoutDashboard className="w-3 h-3" /> },
                { label: 'Subscription Plans', icon: <CreditCard className="w-3 h-3" /> },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate({ to: '/subscription' })}
                    className="flex items-center gap-1.5 text-sm text-white/60 hover:text-[oklch(0.75_0.18_74)] transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Plans */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-3 uppercase tracking-wider">Plans</h4>
            <ul className="space-y-2">
              <li className="text-sm text-white/60">₹5 / Week</li>
              <li className="text-sm text-white/60">₹29 / Month</li>
              <li className="text-sm text-white/60">₹99 / 6 Months</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} DiplomaHub. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[oklch(0.75_0.18_74)] fill-current" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.75_0.18_74)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
