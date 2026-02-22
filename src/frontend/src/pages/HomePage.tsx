import { Link } from '@tanstack/react-router';
import { BookOpen, Users, Award, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Master Your Diploma with{' '}
                <span className="text-primary">Smart Study Resources</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Access comprehensive study materials, chapter-wise notes, video lectures, and practice quizzes for all diploma engineering branches. Just ₹5 per week!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/branches">Explore Branches</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link to="/subscription">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-banner.dim_1200x600.png"
                alt="Students studying"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive learning resources designed specifically for diploma students
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Chapter-wise Materials</CardTitle>
              <CardDescription>
                Organized PDFs, notes, and study materials for every chapter across all subjects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>All Branches Covered</CardTitle>
              <CardDescription>
                CSE, ECE, EEE, Mechanical, Civil, and more - complete coverage for all diploma branches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Daily Quizzes</CardTitle>
              <CardDescription>
                Test your knowledge with subject-specific quizzes and track your progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Study Reminders</CardTitle>
              <CardDescription>
                Set custom reminders for exams, assignments, and study sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Video Lectures</CardTitle>
              <CardDescription>
                Access curated video content and important links for deeper understanding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Leaderboard & Certificates</CardTitle>
              <CardDescription>
                Compete with peers and earn certificates for your achievements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Affordable Learning for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality education shouldn't break the bank
            </p>
          </div>

          <Card className="max-w-md mx-auto border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Weekly Plan</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold text-primary">₹5</span>
                <span className="text-muted-foreground">/week</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Access to all study materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Chapter-wise PDFs and notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Video lectures and links</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Daily quizzes and practice tests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Study reminders and notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Certificates and leaderboard access</span>
                </li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/subscription">Subscribe Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of diploma students who are already excelling with our platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
