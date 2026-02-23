import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { File as BackendFile, UploadedFiles } from '../backend';

export interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  speed: number;
  error?: string;
}

export interface FileMetadata {
  branch: string;
  semester: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  fileType: string;
}

export function useFileUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [uploadQueue, setUploadQueue] = useState<FileUploadItem[]>([]);

  const addToQueue = useCallback((files: File[]) => {
    const newItems: FileUploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending' as const,
      speed: 0,
    }));
    setUploadQueue((prev) => [...prev, ...newItems]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateProgress = useCallback((id: string, progress: number, speed: number) => {
    setUploadQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress, speed, status: 'uploading' as const } : item
      )
    );
  }, []);

  const updateStatus = useCallback((id: string, status: FileUploadItem['status'], error?: string) => {
    setUploadQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, error } : item))
    );
  }, []);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async ({ files, metadata }: { files: FileUploadItem[]; metadata: FileMetadata }) => {
      if (!actor) throw new Error('Actor not available');

      const backendFiles: BackendFile[] = [];

      for (const item of files) {
        try {
          updateStatus(item.id, 'uploading');

          const arrayBuffer = await item.file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);

          // Simulate progress tracking
          const startTime = Date.now();
          let lastUpdate = startTime;
          const totalSize = bytes.length;

          // Update progress in chunks
          for (let i = 0; i <= 100; i += 10) {
            const now = Date.now();
            const elapsed = (now - lastUpdate) / 1000;
            const bytesTransferred = (totalSize * i) / 100;
            const speed = elapsed > 0 ? bytesTransferred / elapsed : 0;

            updateProgress(item.id, i, speed);
            lastUpdate = now;

            // Small delay to simulate upload
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          // Create backend file object
          const backendFile: BackendFile = {
            id: item.id,
            fileType: metadata.fileType as any,
            fileLink: undefined,
            isEncrypted: false,
          };

          backendFiles.push(backendFile);
          updateStatus(item.id, 'success');
        } catch (error) {
          updateStatus(item.id, 'error', error instanceof Error ? error.message : 'Upload failed');
          throw error;
        }
      }

      // Call backend bulk upload
      const uploadData: UploadedFiles = { files: backendFiles };
      await actor.bulkUpload(uploadData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Files uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const retryUpload = useCallback(
    (id: string, metadata: FileMetadata) => {
      const item = uploadQueue.find((i) => i.id === id);
      if (item) {
        updateStatus(id, 'pending');
        uploadMutation.mutate({ files: [item], metadata });
      }
    },
    [uploadQueue, uploadMutation, updateStatus]
  );

  return {
    uploadQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    uploadFiles: uploadMutation.mutate,
    retryUpload,
    isUploading: uploadMutation.isPending,
  };
}
