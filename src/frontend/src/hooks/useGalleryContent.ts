import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Gallery } from '../backend';

export function useGetGalleriesByCategory(
  branch: string | null,
  semester: string | null,
  subject: string | null,
  chapter: string | null
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Gallery[]>({
    queryKey: ['galleries', branch, semester, subject, chapter],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGalleriesByCategory(branch, semester, subject, chapter);
    },
    enabled: !!actor && !actorFetching && (!!branch || !!semester || !!subject || !!chapter),
    retry: false,
  });
}

export function useGetGalleryById(galleryId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Gallery | null>({
    queryKey: ['gallery', galleryId],
    queryFn: async () => {
      if (!actor || !galleryId) return null;
      return actor.getGalleryById(galleryId);
    },
    enabled: !!actor && !actorFetching && !!galleryId,
    retry: false,
  });
}
