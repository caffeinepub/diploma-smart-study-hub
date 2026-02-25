import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useDeleteFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteFile(fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('File deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });
}

export function useDeleteVideoLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteVideoLink(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoLinks'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Video link deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete video link: ${error.message}`);
    },
  });
}

export function useDeleteImportantLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteImportantLink(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importantLinks'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Important link deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete link: ${error.message}`);
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
}

export function useBulkDeleteCategories() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryIds: string[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.bulkDeleteCategories(categoryIds);
    },
    onSuccess: (_, categoryIds) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success(`${categoryIds.length} categories deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete categories: ${error.message}`);
    },
  });
}
