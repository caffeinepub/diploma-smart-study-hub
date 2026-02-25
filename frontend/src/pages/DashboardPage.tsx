import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubscription } from '../hooks/useSubscription';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GraduationCap, BookOpen, CreditCard, ArrowRight, CheckCircle,
  XCircle, Clock, User
} from 'lucide-react';

const BRANCHES = [
  { short: 'CSE', name: 'Computer Science', icon: '/assets/generated/icon-cse.dim_128x128.png' },
  { short: 'ECE', name: 'Electronics', icon: '/assets/generated/icon-ece.dim_128x128.png' },
  { short: 'EEE', name: 'Electrical', icon: '/assets/generated/icon-eee.dim_128x128.png' },
  { short: 'MECH', name: 'Mechanical', icon: '/assets/generated/icon-mech.dim_128x128.png' },
  { short: 'CIVIL', name: 'Civil', icon: '/assets/generated/icon-civil.dim_128x128.png' },
  { short: 'CHEM', name: 'Chemical' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isSubscribed, isLoading: subLoading } = useSubscription();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();

  const principalText = identity?.getPrincipal().toString() ?? '';
  const shortPrincipal = principalText ? `${principalText.slice(0, 8)}...${principalText.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[oklch(0.75_0.18_74)] flex items-center justify-center">
              <User className="w-6 h-6 text-[oklch(0.15_0.03_240)]" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl">
                {profileLoading ? 'Loading...' : profile?.name ? `Welcome, ${profile.name}!` : 'Student Dashboard'}
              </h1>
              <p className="text-white/60 text-xs">{shortPrincipal}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Subscription Status Card */}
        <Card className={`border-2 shadow-card ${isSubscribed ? 'border-green-500/30 bg-green-500/5' : 'border-[oklch(0.75_0.18_74)]/30 bg-[oklch(0.75_0.18_74)]/5'}`}>
          <CardContent className="p-5">
            {subLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            ) : isSubscribed ? (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Subscription Active</p>
                    <p className="text-sm text-muted-foreground">You have full access to all course content</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-700 border-green-500/30 flex-shrink-0">Active</Badge>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.75_0.18_74)]/20 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-[oklch(0.65_0.18_74)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No Active Subscription</p>
                    <p className="text-sm text-muted-foreground">Subscribe to unlock all course materials</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: '/subscription' })}
                  className="bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold flex-shrink-0"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Subscribe Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Branches', value: '6', icon: <GraduationCap className="w-5 h-5" />, color: 'text-blue-500' },
            { label: 'Semesters', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-green-500' },
            { label: 'Subjects', value: '40+', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-500' },
            { label: 'Study Hours', value: '∞', icon: <Clock className="w-5 h-5" />, color: 'text-orange-500' },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card border border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Branch Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-foreground">Browse by Branch</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/branches' })}
              className="text-primary hover:text-primary/80"
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BRANCHES.map((branch) => (
              <Card
                key={branch.short}
                className="cursor-pointer hover:shadow-md transition-all border border-border/50 hover:border-primary/30 group"
                onClick={() => navigate({ to: '/semesters/$branch', params: { branch: branch.short } })}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                  {branch.icon ? (
                    <img src={branch.icon} alt={branch.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{branch.short}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{branch.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading font-bold text-lg text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-all border border-border/50 hover:border-primary/30 group"
              onClick={() => navigate({ to: '/branches' })}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">Browse Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">Access study materials, notes, and videos for your branch</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-all border border-border/50 hover:border-primary/30 group"
              onClick={() => navigate({ to: '/subscription' })}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.75_0.18_74)]/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[oklch(0.65_0.18_74)]" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">Subscription</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">Manage your subscription and payment history</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
