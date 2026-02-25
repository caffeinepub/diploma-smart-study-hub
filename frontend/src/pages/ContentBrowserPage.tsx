import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGalleryContent } from '../hooks/useGalleryContent';
import { useContentAccess } from '../hooks/useContentAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionPromptDialog from '../components/content/SubscriptionPromptDialog';
import {
  ArrowLeft, BookOpen, Video, FileText, Lock,
  GraduationCap, AlertCircle
} from 'lucide-react';
import { Gallery } from '../backend';

export default function ContentBrowserPage() {
  const { branch, semester } = useParams({ from: '/content/$branch/$semester' });
  const navigate = useNavigate();
  const { hasAccess, isAdmin } = useContentAccess();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [_selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

  const { data: galleries, isLoading, error } = useGalleryContent(branch, semester, null, null);

  const handleLockedClick = () => {
    if (!hasAccess) {
      setShowSubscriptionPrompt(true);
    }
  };

  const pdfGalleries = galleries?.filter(g =>
    g.images.length > 0 || g.title.toLowerCase().includes('pdf') || g.title.toLowerCase().includes('note')
  ) ?? [];

  const videoGalleries = galleries?.filter(g =>
    g.videos.length > 0 || g.title.toLowerCase().includes('video') || g.title.toLowerCase().includes('lecture')
  ) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[oklch(0.22_0.09_255)] to-[oklch(0.32_0.12_255)] text-white py-8 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/semesters/$branch', params: { branch } })}
            className="text-white/70 hover:text-white hover:bg-white/10 mb-3 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Semesters
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[oklch(0.75_0.18_74)] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[oklch(0.15_0.03_240)]" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl md:text-2xl">{branch} — Semester {semester}</h1>
                <p className="text-white/70 text-sm">Study materials & resources</p>
              </div>
            </div>
            {!hasAccess && (
              <Badge className="bg-[oklch(0.75_0.18_74)]/20 text-[oklch(0.75_0.18_74)] border-[oklch(0.75_0.18_74)]/30 hidden sm:flex items-center gap-1">
                <Lock className="w-3 h-3" /> Premium Content
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Subscription Alert */}
        {!hasAccess && !isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-[oklch(0.75_0.18_74)]/10 border border-[oklch(0.75_0.18_74)]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[oklch(0.68_0.17_72)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm mb-1">Premium Content Locked</p>
              <p className="text-xs text-muted-foreground mb-2">
                Subscribe to unlock all notes, PDFs, and video lectures for this semester.
              </p>
              <Button
                size="sm"
                onClick={() => navigate({ to: '/subscription' })}
                className="bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold text-xs h-7"
              >
                Subscribe Now — Starting ₹5/week
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-foreground mb-2">Content Locked</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {!hasAccess ? 'Subscribe to access this content.' : 'No content available yet.'}
            </p>
            {!hasAccess && (
              <Button
                onClick={() => navigate({ to: '/subscription' })}
                className="bg-[oklch(0.75_0.18_74)] hover:bg-[oklch(0.80_0.18_76)] text-[oklch(0.15_0.03_240)] font-semibold"
              >
                View Subscription Plans
              </Button>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="all" className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> All ({galleries?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Notes ({pdfGalleries.length})
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Videos ({videoGalleries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ContentGrid
                galleries={galleries ?? []}
                hasAccess={hasAccess}
                onLockedClick={handleLockedClick}
                onSelect={setSelectedGallery}
              />
            </TabsContent>
            <TabsContent value="notes">
              <ContentGrid
                galleries={pdfGalleries}
                hasAccess={hasAccess}
                onLockedClick={handleLockedClick}
                onSelect={setSelectedGallery}
              />
            </TabsContent>
            <TabsContent value="videos">
              <ContentGrid
                galleries={videoGalleries}
                hasAccess={hasAccess}
                onLockedClick={handleLockedClick}
                onSelect={setSelectedGallery}
              />
            </TabsContent>
          </Tabs>
        )}

        {galleries?.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <img src="/assets/generated/empty-state.dim_400x300.png" alt="No content" className="w-48 mx-auto mb-4 opacity-60" />
            <h3 className="font-heading font-semibold text-foreground mb-2">No Content Yet</h3>
            <p className="text-sm text-muted-foreground">
              Content for {branch} Semester {semester} will be added soon.
            </p>
          </div>
        )}
      </div>

      <SubscriptionPromptDialog
        open={showSubscriptionPrompt}
        onOpenChange={setShowSubscriptionPrompt}
        onClose={() => setShowSubscriptionPrompt(false)}
      />
    </div>
  );
}

function ContentGrid({
  galleries,
  hasAccess,
  onLockedClick,
  onSelect,
}: {
  galleries: Gallery[];
  hasAccess: boolean;
  onLockedClick: () => void;
  onSelect: (g: Gallery) => void;
}) {
  if (galleries.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        No content available in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {galleries.map((gallery) => (
        <div key={gallery.id} className="relative">
          <Card
            className={`border-2 border-border hover:border-primary/30 transition-all shadow-card ${
              hasAccess ? 'cursor-pointer hover:shadow-navy' : 'cursor-pointer'
            }`}
            onClick={() => hasAccess ? onSelect(gallery) : onLockedClick()}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-heading font-semibold text-foreground leading-tight">
                  {gallery.title}
                </CardTitle>
                {!hasAccess && <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {gallery.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{gallery.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {gallery.images.length > 0 && (
                  <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" /> {gallery.images.length} PDF{gallery.images.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {gallery.videos.length > 0 && (
                  <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                    <Video className="w-2.5 h-2.5" /> {gallery.videos.length} Video{gallery.videos.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {gallery.subject && (
                  <Badge variant="secondary" className="text-[10px]">{gallery.subject}</Badge>
                )}
              </div>
              {hasAccess && (gallery.images.length > 0 || gallery.videos.length > 0) && (
                <div className="mt-3 flex gap-2">
                  {gallery.images.length > 0 && (
                    <Button size="sm" variant="outline" className="h-7 text-xs flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View PDFs
                    </Button>
                  )}
                  {gallery.videos.length > 0 && (
                    <Button size="sm" variant="outline" className="h-7 text-xs flex items-center gap-1">
                      <Video className="w-3 h-3" /> Watch Videos
                    </Button>
                  )}
                </div>
              )}
              {!hasAccess && (
                <div className="mt-3 p-2 rounded-lg bg-muted/50 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Subscribe to unlock this content</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
