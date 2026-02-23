import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Smartphone, BookOpen, FileText, Video, Image as ImageIcon, Link as LinkIcon, Trophy } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-4 border-success shadow-warm-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <CardTitle className="text-4xl font-display text-success">Payment Successful!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Your subscription is now active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-2 border-success bg-success/5">
              <CheckCircle className="h-5 w-5 text-success" />
              <AlertDescription className="text-base">
                <p className="font-semibold mb-2 text-success-foreground">
                  Payment of <strong className="text-success text-xl">₹5</strong> successfully processed
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Paid to: <span className="font-medium">9392412728</span>
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Your Subscription Details
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-semibold">Weekly Subscription</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">7 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-success">Active Now</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                All Content Unlocked!
              </h3>
              <p className="text-muted-foreground">
                You now have full access to all study materials across all branches, semesters, subjects, and chapters:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: 'PDFs & Notes', color: 'text-blue-500' },
                  { icon: Video, label: 'Video Lectures', color: 'text-red-500' },
                  { icon: ImageIcon, label: 'Image Galleries', color: 'text-green-500' },
                  { icon: LinkIcon, label: 'Important Links', color: 'text-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Alert className="border-primary/50 bg-primary/5">
              <AlertDescription className="text-base">
                <p className="font-medium mb-2">🎉 What You Can Do Now:</p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
                  <li>Browse and download all study materials</li>
                  <li>Watch video lectures without restrictions</li>
                  <li>Access image galleries and diagrams</li>
                  <li>View important links and resources</li>
                  <li>Take daily quizzes and track progress</li>
                  <li>Compete on leaderboards</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full py-6 text-lg rounded-full shadow-warm" size="lg">
                <Link to="/branches">Start Exploring Content</Link>
              </Button>
              <Button asChild variant="outline" className="w-full py-6 text-lg rounded-full" size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>Need help? Contact us at <strong>+91 9392412728</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
