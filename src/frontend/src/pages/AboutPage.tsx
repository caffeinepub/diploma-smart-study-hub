import { BookOpen, Target, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About <span className="text-primary">Diploma Smart Study Hub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering diploma students with accessible, affordable, and comprehensive study resources
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Diploma Smart Study Hub was created with a simple yet powerful mission: to make quality education accessible to every diploma student, regardless of their financial background.
            </p>
            <p>
              We understand the challenges faced by diploma students - limited resources, expensive study materials, and the need for organized, semester-wise content. That's why we've built a platform that provides everything you need at an incredibly affordable price of just ₹5 per week.
            </p>
            <p>
              Our platform covers all major diploma engineering branches including Computer Science, Electronics & Communication, Electrical & Electronics, Mechanical, Civil Engineering, and more. Every subject is organized by semester and chapter, making it easy to find exactly what you need.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comprehensive Content</CardTitle>
              <CardDescription>
                Access PDFs, notes, video lectures, and important links organized by branch, semester, subject, and chapter
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Focused Learning</CardTitle>
              <CardDescription>
                Daily quizzes, study reminders, and progress tracking help you stay on top of your studies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Compete on leaderboards, share feedback, and learn alongside thousands of fellow diploma students
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Recognition & Growth</CardTitle>
              <CardDescription>
                Earn certificates for your achievements and track your learning journey with detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Affordable Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  At just ₹5 per week, quality education is accessible to everyone
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complete Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  All diploma branches, all semesters, all subjects - everything in one place
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  New content added regularly, keeping you up-to-date with the latest syllabus
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mobile Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Study anywhere, anytime with our fully responsive platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
