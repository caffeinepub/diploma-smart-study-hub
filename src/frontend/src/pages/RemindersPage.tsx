import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function RemindersPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const reminders = [
    { id: 1, title: 'Database Exam', type: 'exam', date: '2026-02-25', time: '10:00', notes: 'Prepare chapters 1-5' },
    { id: 2, title: 'Assignment Submission', type: 'assignment', date: '2026-02-27', time: '17:00', notes: 'Complete all questions' },
    { id: 3, title: 'Study Session', type: 'study', date: '2026-02-28', time: '15:00', notes: 'Review data structures' },
  ];

  const getTypeColor = (type: string) => {
    if (type === 'exam') return 'bg-red-500 hover:bg-red-600';
    if (type === 'assignment') return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Reminders</h1>
            <p className="text-muted-foreground">Manage your study schedule and deadlines</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
                <DialogDescription>Set up a reminder for your study session, exam, or assignment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g., Mathematics Exam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Session</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Add any additional notes..." rows={3} />
                </div>
                <Button className="w-full">Create Reminder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{reminder.title}</CardTitle>
                      <Badge className={getTypeColor(reminder.type)}>{reminder.type}</Badge>
                    </div>
                    <CardDescription>{reminder.notes}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{reminder.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
