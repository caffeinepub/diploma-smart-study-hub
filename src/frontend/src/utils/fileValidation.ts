export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileSize(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${formatFileSize(MAX_FILE_SIZE_BYTES)}`,
    };
  }
  return { valid: true };
}

export function validateVideoSize(file: File): FileValidationResult {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video size exceeds maximum limit of ${formatFileSize(MAX_VIDEO_SIZE_BYTES)}`,
    };
  }
  return { valid: true };
}

export function validateFileType(file: File, allowedTypes: string[]): FileValidationResult {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

export function validateVideoType(file: File): FileValidationResult {
  const allowedTypes = ['mp4', 'webm', 'mov'];
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Video type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatUploadSpeed(bytesPerSecond: number): string {
  return formatFileSize(bytesPerSecond) + '/s';
}
