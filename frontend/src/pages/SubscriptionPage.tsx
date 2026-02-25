import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubscription } from '../hooks/useSubscription';
import { useCreateCheckoutSession } from '../hooks/usePaymentConfirmation';
import { usePaymentConfirmation } from '../hooks/usePaymentConfirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  CheckCircle, CreditCard, Zap, BookOpen, Video, FileText,
  Shield, Star, ArrowRight, Loader2, XCircle
} from 'lucide-react';
import { ShoppingItem } from '../backend';

const PLANS = [
  {
    id: 'weekly',
    name: 'Weekly Plan',
    price: 5,
    priceDisplay: '₹5',
    period: 'week',
    duration: '7 days',
    priceInPaise: 500,
    features: [
      'Access to all branches',
      'Semester-wise notes & PDFs',
      'Video lectures',
      'Study materials',
    ],
    color: 'border-blue-500/30 hover:border-blue-500/50',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 29,
    priceDisplay: '₹29',
    period: 'month',
    duration: '30 days',
    priceInPaise: 2900,
    popular: true,
    features: [
      'Access to all branches',
      'Semester-wise notes & PDFs',
      'Video lectures',
      'Study materials',
      'Priority support',
    ],
    color: 'border-[oklch(0.75_0.18_74)] hover:border-[oklch(0.80_0.18_76)]',
    badgeColor: 'bg-[oklch(0.75_0.18_74)]/10 text-[oklch(0.58_0.15_70)] border-[oklch(0.75_0.18_74)]/30',
  },
  {
    id: 'halfyearly',
    name: 'Half-Yearly Plan',
    price: 99,
    priceDisplay: '₹99',
    period: '6 months',
    duration: '180 days',
    priceInPaise: 9900,
    best: true,
    features: [
      'Access to all branches',
      'Semester-wise notes & PDFs',
      'Video lectures',
      'Study materials',
      'Priority support',
      'Best value — save 60%',
    ],
    color: 'border-primary/40 hover:border-primary/60',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
  },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isSubscribed } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const createCheckout = useCreateCheckoutSession();
  const confirmPayment = usePaymentConfirmation();

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (!identity) {
      navigate({ to: '/login' });
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const item: ShoppingItem = {
        productName: plan.name,
        currency: 'inr',
        quantity: BigInt(1),
        priceInCents: BigInt(plan.priceInPaise),
        productDescription: `DiplomaHub ${plan.name} - ${plan.duration} access to all study materials`,
      };

      const sessionJson = await createCheckout.mutateAsync([item]);
      const session = JSON.parse(sessionJson);

      if (session?.url) {
        window.location.href = session.url;
      } else {
        toast.error('Payment session could not be created. Please try again.');
      }
    } catch (error: any) {
      const msg = error?.message ?? '';
      if (msg.includes('Stripe needs to be first configured')) {
        toast.error('Payment system is being set up. Please contact admin.');
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white py-10 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[oklch(0.75_0.18_74)] mb-4">
            <CreditCard className="w-6 h-6 text-[oklch(0.15_0.03_240)]" />
          </div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Choose Your Plan</h1>
          <p className="text-white/70 text-sm md:text-base max-w-md mx-auto">
            Unlock all study materials, notes, and video lectures for your Diploma engineering course
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Active Subscription Banner */}
        {isSubscribed && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">You have an active subscription!</p>
              <p className="text-xs text-muted-foreground">You already have full access to all content.</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate({ to: '/branches' })}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white font-semibold flex-shrink-0"
            >
              Browse Content <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-2 shadow-card transition-all ${plan.color} ${
                plan.popular ? 'shadow-amber' : plan.best ? 'shadow-navy' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[oklch(0.75_0.18_74)] text-[oklch(0.15_0.03_240)] font-semibold text-xs px-3">
                    <Star className="w-3 h-3 mr-1" /> Most Popular
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
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="font-heading text-base text-foreground">{plan.name}</CardTitle>
                <div className="mt-1">
                  <span className="font-heading font-bold text-3xl text-foreground">{plan.priceDisplay}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.duration} access</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan !== null}
                  className={`w-full font-semibold ${
                    plan.popular
                      ? 'bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)]'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Subscribe — {plan.priceDisplay}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-semibold text-foreground text-center mb-4">What's Included in All Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <BookOpen className="w-5 h-5" />, title: 'Branch-wise Notes', desc: 'Organized notes for all 7 branches and 8 semesters' },
              { icon: <Video className="w-5 h-5" />, title: 'Video Lectures', desc: 'High-quality video content for every subject' },
              { icon: <FileText className="w-5 h-5" />, title: 'PDF Resources', desc: 'Downloadable PDFs, question papers & study guides' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security Note */}
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Secure payment processing. Your subscription activates immediately after successful payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
