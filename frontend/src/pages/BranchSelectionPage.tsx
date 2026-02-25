import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';

const BRANCHES = [
  {
    name: 'Computer Science Engineering',
    short: 'CSE',
    icon: '/assets/generated/icon-cse.dim_128x128.png',
    desc: 'Programming, Data Structures, Networks, OS',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
    badge: 'Most Popular',
  },
  {
    name: 'Electronics & Communication',
    short: 'ECE',
    icon: '/assets/generated/icon-ece.dim_128x128.png',
    desc: 'Circuits, Signals, Communication Systems',
    color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40',
  },
  {
    name: 'Electrical Engineering',
    short: 'EEE',
    icon: '/assets/generated/icon-eee.dim_128x128.png',
    desc: 'Power Systems, Machines, Control Systems',
    color: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40',
  },
  {
    name: 'Mechanical Engineering',
    short: 'MECH',
    icon: '/assets/generated/icon-mech.dim_128x128.png',
    desc: 'Thermodynamics, Fluid Mechanics, Manufacturing',
    color: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40',
  },
  {
    name: 'Civil Engineering',
    short: 'CIVIL',
    icon: '/assets/generated/icon-civil.dim_128x128.png',
    desc: 'Structures, Surveying, Construction Materials',
    color: 'from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40',
  },
  {
    name: 'Chemical Engineering',
    short: 'CHEM',
    desc: 'Process Engineering, Thermodynamics, Reactions',
    color: 'from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40',
  },
  {
    name: 'Other Branches',
    short: 'OTHER',
    desc: 'Mining, Textile, Automobile & more',
    color: 'from-gray-500/10 to-gray-600/5 border-gray-500/20 hover:border-gray-500/40',
  },
];

export default function BranchSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white py-10 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[oklch(0.75_0.18_74)] mb-4">
            <BookOpen className="w-6 h-6 text-[oklch(0.15_0.03_240)]" />
          </div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Select Your Branch</h1>
          <p className="text-white/70 text-sm md:text-base">
            Choose your engineering branch to access semester-wise study materials
          </p>
        </div>
      </div>

      {/* Branch Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRANCHES.map((branch) => (
            <button
              key={branch.short}
              onClick={() => navigate({ to: '/semesters/$branch', params: { branch: branch.short } })}
              className="text-left group"
            >
              <Card className={`h-full border-2 bg-gradient-to-br ${branch.color} transition-all duration-200 hover:shadow-navy hover:-translate-y-0.5`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-background/80 flex items-center justify-center flex-shrink-0 shadow-card">
                      {branch.icon ? (
                        <img src={branch.icon} alt={branch.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <GraduationCap className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-lg text-foreground">{branch.short}</span>
                        {branch.badge && (
                          <Badge className="bg-[oklch(0.75_0.18_74)] text-[oklch(0.15_0.03_240)] text-[10px] font-semibold px-1.5 py-0">
                            {branch.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground/80 mb-1">{branch.name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{branch.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 8 Semesters</span>
                    <span>•</span>
                    <span>Notes & Videos</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
