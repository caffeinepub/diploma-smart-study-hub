import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, BookOpen, Video, FileText, Users, Star,
  ArrowRight, CheckCircle, Zap, Shield, Clock
} from 'lucide-react';

const BRANCHES = [
  { name: 'Computer Science', short: 'CSE', icon: '/assets/generated/icon-cse.dim_128x128.png', color: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'Electronics & Comm.', short: 'ECE', icon: '/assets/generated/icon-ece.dim_128x128.png', color: 'bg-purple-500/10 border-purple-500/20' },
  { name: 'Electrical Engg.', short: 'EEE', icon: '/assets/generated/icon-eee.dim_128x128.png', color: 'bg-yellow-500/10 border-yellow-500/20' },
  { name: 'Mechanical Engg.', short: 'MECH', icon: '/assets/generated/icon-mech.dim_128x128.png', color: 'bg-orange-500/10 border-orange-500/20' },
  { name: 'Civil Engg.', short: 'CIVIL', icon: '/assets/generated/icon-civil.dim_128x128.png', color: 'bg-green-500/10 border-green-500/20' },
  { name: 'Chemical Engg.', short: 'CHEM', color: 'bg-red-500/10 border-red-500/20' },
];

const FEATURES = [
  { icon: <BookOpen className="w-6 h-6" />, title: 'Branch-wise Notes', desc: 'Organized notes for all branches and semesters' },
  { icon: <Video className="w-6 h-6" />, title: 'Video Lectures', desc: 'High-quality video content for every subject' },
  { icon: <FileText className="w-6 h-6" />, title: 'PDF Resources', desc: 'Downloadable PDFs, question papers & more' },
  { icon: <Zap className="w-6 h-6" />, title: 'Instant Access', desc: 'Unlock content immediately after subscribing' },
  { icon: <Shield className="w-6 h-6" />, title: 'Secure Platform', desc: 'Decentralized & secure on Internet Computer' },
  { icon: <Clock className="w-6 h-6" />, title: 'Study Anytime', desc: 'Access your materials 24/7 from any device' },
];

const PLANS = [
  { name: 'Weekly', price: '₹5', period: 'week', duration: '7 days', features: ['All branches', 'Notes & PDFs', 'Video lectures'] },
  { name: 'Monthly', price: '₹29', period: 'month', duration: '30 days', features: ['All branches', 'Notes & PDFs', 'Video lectures', 'Priority support'], popular: true },
  { name: 'Half-Yearly', price: '₹99', period: '6 months', duration: '180 days', features: ['All branches', 'Notes & PDFs', 'Video lectures', 'Priority support', 'Best value'], best: true },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.18_0.08_255)] via-[oklch(0.22_0.09_255)] to-[oklch(0.28_0.11_255)] text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/generated/hero-banner.dim_1200x600.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-[oklch(0.75_0.18_74)]/20 text-[oklch(0.75_0.18_74)] border-[oklch(0.75_0.18_74)]/30 text-xs font-semibold px-3 py-1">
              🎓 Diploma Engineering Platform
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Study Smarter with{' '}
              <span className="text-[oklch(0.75_0.18_74)]">DiplomaHub</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-8 leading-relaxed">
              Access branch-wise notes, video lectures, and study materials for all Diploma engineering semesters. Starting at just ₹5/week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate({ to: '/branches' })}
                    className="h-12 px-8 bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold text-base rounded-xl shadow-amber"
                  >
                    Browse Branches <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate({ to: '/dashboard' })}
                    variant="outline"
                    className="h-12 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    My Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate({ to: '/login' })}
                    className="h-12 px-8 bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold text-base rounded-xl shadow-amber"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate({ to: '/subscription' })}
                    variant="outline"
                    className="h-12 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    View Plans
                  </Button>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 1000+ Students</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[oklch(0.75_0.18_74)]" /> 4.8 Rating</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> 6 Branches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Preview */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
              All Engineering Branches
            </h2>
            <p className="text-muted-foreground">Comprehensive study materials for every branch</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BRANCHES.map((branch) => (
              <button
                key={branch.short}
                onClick={() => isAuthenticated ? navigate({ to: '/semesters/$branch', params: { branch: branch.short } }) : navigate({ to: '/login' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${branch.color} hover:scale-105 transition-all duration-200 group`}
              >
                {branch.icon ? (
                  <img src={branch.icon} alt={branch.name} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                )}
                <span className="font-heading font-bold text-sm text-foreground">{branch.short}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{branch.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
              Everything You Need to Excel
            </h2>
            <p className="text-muted-foreground">Powerful features designed for Diploma students</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-border/50 shadow-card hover:shadow-navy transition-shadow">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
              Simple, Affordable Plans
            </h2>
            <p className="text-muted-foreground">Choose the plan that works best for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-2 shadow-card transition-all hover:shadow-navy ${
                  plan.popular
                    ? 'border-[oklch(0.75_0.18_74)] shadow-amber'
                    : plan.best
                    ? 'border-primary'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[oklch(0.75_0.18_74)] text-[oklch(0.15_0.03_240)] font-semibold text-xs px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground font-semibold text-xs px-3">
                      Best Value
                    </Badge>
                  </div>
                )}
                <CardContent className="p-5 pt-6">
                  <h3 className="font-heading font-bold text-foreground mb-1">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="font-heading font-bold text-3xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.duration} access</p>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate({ to: isAuthenticated ? '/subscription' : '/login' })}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)]'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    } font-semibold`}
                    size="sm"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
            Ready to Start Learning?
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Join thousands of Diploma students already using DiplomaHub to ace their exams.
          </p>
          <Button
            onClick={() => navigate({ to: isAuthenticated ? '/branches' : '/login' })}
            className="h-12 px-8 bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold text-base rounded-xl shadow-amber"
          >
            Start Learning Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
