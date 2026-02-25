import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';

const SEMESTER_INFO: Record<number, { subjects: string[]; focus: string }> = {
  1: { subjects: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical'], focus: 'Foundation' },
  2: { subjects: ['Engineering Mathematics II', 'Engineering Drawing', 'Workshop Practice', 'Communication Skills'], focus: 'Foundation' },
  3: { subjects: ['Applied Mathematics', 'Core Subject I', 'Core Subject II', 'Core Subject III'], focus: 'Core' },
  4: { subjects: ['Applied Mathematics II', 'Core Subject IV', 'Core Subject V', 'Core Subject VI'], focus: 'Core' },
  5: { subjects: ['Core Subject VII', 'Core Subject VIII', 'Elective I', 'Industrial Training'], focus: 'Advanced' },
  6: { subjects: ['Core Subject IX', 'Core Subject X', 'Elective II', 'Project Work I'], focus: 'Advanced' },
  7: { subjects: ['Core Subject XI', 'Elective III', 'Project Work II', 'Seminar'], focus: 'Final' },
  8: { subjects: ['Project Work III', 'Elective IV', 'Industrial Visit', 'Viva Voce'], focus: 'Final' },
};

const FOCUS_COLORS: Record<string, string> = {
  Foundation: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Core: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Advanced: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Final: 'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function SemesterSelectionPage() {
  const { branch } = useParams({ from: '/semesters/$branch' });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white py-10 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/branches' })}
            className="text-white/70 hover:text-white hover:bg-white/10 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Branches
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[oklch(0.75_0.18_74)] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[oklch(0.15_0.03_240)]" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl">{branch} — Select Semester</h1>
              <p className="text-white/70 text-sm">Choose a semester to access study materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => {
            const info = SEMESTER_INFO[sem];
            return (
              <button
                key={sem}
                onClick={() => navigate({ to: '/content/$branch/$semester', params: { branch, semester: sem.toString() } })}
                className="text-left group"
              >
                <Card className="h-full border-2 border-border hover:border-primary/40 hover:shadow-navy transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-heading font-bold text-primary text-lg">{sem}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-sm mb-1">Semester {sem}</h3>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold mb-2 ${FOCUS_COLORS[info.focus]}`}
                    >
                      {info.focus}
                    </Badge>
                    <ul className="space-y-0.5">
                      {info.subjects.slice(0, 2).map((subj) => (
                        <li key={subj} className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{subj}</span>
                        </li>
                      ))}
                      {info.subjects.length > 2 && (
                        <li className="text-[10px] text-muted-foreground">+{info.subjects.length - 2} more subjects</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">What's included in each semester?</p>
              <p className="text-xs text-muted-foreground">
                Each semester contains subject-wise notes (PDFs), video lectures, important questions, and previous year papers. Premium content requires an active subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
