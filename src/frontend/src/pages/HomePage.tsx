import { Link } from '@tanstack/react-router';
import { BookOpen, Users, Award, Clock, CheckCircle, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Pattern Background */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: 'url(/assets/generated/hero-pattern.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="container relative py-24 md:py-36">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-display font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
                Master Your Diploma with{' '}
                <span className="text-primary">Smart Study Resources</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Access comprehensive study materials, chapter-wise notes, video lectures, image galleries, and practice quizzes for all diploma engineering branches. Just ₹5 per week!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full shadow-warm-lg hover:shadow-warm">
                  <Link to="/branches">Explore Branches</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6 rounded-full border-2">
                  <Link to="/subscription">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-2xl" />
              <img
                src="/assets/generated/education-banner.dim_1600x600.png"
                alt="Students studying"
                className="relative rounded-3xl shadow-2xl border-4 border-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold tracking-tight sm:text-5xl mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive learning resources designed specifically for diploma students
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Chapter-wise Materials</CardTitle>
              <CardDescription className="text-base">
                Organized PDFs, notes, and study materials for every chapter across all subjects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <ImageIcon className="h-7 w-7 text-accent" />
              </div>
              <CardTitle className="text-2xl">Image Galleries</CardTitle>
              <CardDescription className="text-base">
                Visual learning with curated image galleries for diagrams, circuits, and lab equipment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <Users className="h-7 w-7 text-secondary" />
              </div>
              <CardTitle className="text-2xl">All Branches Covered</CardTitle>
              <CardDescription className="text-base">
                CSE, ECE, EEE, Mechanical, Civil, and more - complete coverage for all diploma branches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Daily Quizzes</CardTitle>
              <CardDescription className="text-base">
                Test your knowledge with subject-specific quizzes and track your progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <CardTitle className="text-2xl">Study Reminders</CardTitle>
              <CardDescription className="text-base">
                Set custom reminders for exams, assignments, and study sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-warm group">
            <CardHeader className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <TrendingUp className="h-7 w-7 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Leaderboard & Certificates</CardTitle>
              <CardDescription className="text-base">
                Compete with peers and earn certificates for your achievements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold tracking-tight sm:text-5xl mb-6">
              Affordable Learning for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quality education shouldn't break the bank
            </p>
          </div>

          <Card className="max-w-lg mx-auto border-4 border-primary shadow-warm-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl font-display">Weekly Plan</CardTitle>
              <div className="mt-6">
                <span className="text-7xl font-bold text-primary">₹5</span>
                <span className="text-2xl text-muted-foreground">/week</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {[
                  'Access to all study materials',
                  'Chapter-wise PDFs and notes',
                  'Image galleries and diagrams',
                  'Video lectures and links',
                  'Daily quizzes and practice tests',
                  'Study reminders and notifications',
                  'Certificates and leaderboard access',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full py-6 text-lg rounded-full shadow-warm" size="lg">
                <Link to="/subscription">Subscribe Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-4 border-primary/20 shadow-warm-lg">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-display font-bold tracking-tight sm:text-5xl mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of diploma students who are already excelling with our platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full shadow-warm">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6 rounded-full border-2">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
