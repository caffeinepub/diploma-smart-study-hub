import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { GalleryImage, GalleryVideo } from '../backend';

export function useCreateGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      branch: string | null;
      semester: string | null;
      subject: string | null;
      chapter: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGallery(
        params.title,
        params.description,
        params.branch,
        params.semester,
        params.subject,
        params.chapter
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Gallery created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create gallery: ${error.message}`);
    },
  });
}

export function useUploadGalleryImages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { galleryId: string; images: GalleryImage[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadGalleryImages(params.galleryId, params.images);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Images uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload images: ${error.message}`);
    },
  });
}

export function useUploadGalleryVideos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { galleryId: string; videos: GalleryVideo[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadGalleryVideos(params.galleryId, params.videos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Videos uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload videos: ${error.message}`);
    },
  });
}

export function useDeleteGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (galleryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGallery(galleryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Gallery deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete gallery: ${error.message}`);
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { galleryId: string; imageId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryImage(params.galleryId, params.imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Image deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete image: ${error.message}`);
    },
  });
}

export function useDeleteGalleryVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { galleryId: string; videoId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryVideo(params.galleryId, params.videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      toast.success('Video deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete video: ${error.message}`);
    },
  });
}
