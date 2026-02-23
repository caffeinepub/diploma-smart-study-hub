import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const branches = [
  {
    id: 'cse',
    name: 'Computer Science Engineering',
    icon: '/assets/generated/icon-cse.dim_128x128.png',
    description: 'Programming, algorithms, databases, and software development',
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    icon: '/assets/generated/icon-ece.dim_128x128.png',
    description: 'Digital electronics, communication systems, and signal processing',
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics',
    icon: '/assets/generated/icon-eee.dim_128x128.png',
    description: 'Power systems, electrical machines, and control systems',
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    icon: '/assets/generated/icon-mech.dim_128x128.png',
    description: 'Thermodynamics, mechanics, manufacturing, and design',
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: '/assets/generated/icon-civil.dim_128x128.png',
    description: 'Structures, construction, surveying, and environmental engineering',
  },
  {
    id: 'other',
    name: 'Other Branches',
    icon: '/assets/generated/icon-cse.dim_128x128.png',
    description: 'Automobile, chemical, textile, and other diploma branches',
  },
];

export default function BranchSelectionPage() {
  return (
    <div className="container py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-display font-bold tracking-tight sm:text-6xl">
            Choose Your <span className="text-primary">Branch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select your diploma engineering branch to access semester-wise study materials, notes, and resources
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-warm-lg group"
            >
              <CardHeader className="text-center space-y-6">
                <div className="mx-auto h-28 w-28 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <img src={branch.icon} alt={branch.name} className="h-16 w-16" />
                </div>
                <CardTitle className="text-2xl font-display">{branch.name}</CardTitle>
                <CardDescription className="text-center text-base">{branch.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full rounded-full py-6 shadow-warm" variant="outline">
                  <Link to="/content/$branch" params={{ branch: branch.id }}>
                    View Materials
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
