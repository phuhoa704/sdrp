import { medusa } from '../medusa';

/**
 * Medusa Upload Service
 * Handles file uploads to Medusa Backend
 */
class UploadService {
    /**
     * Upload one or more files to Medusa
     * @param files File or array of Files to upload
     */
    async upload(files: File | File[]): Promise<{ uploads: { url: string }[] }> {
        try {
            const filesToUpload = Array.isArray(files) ? files : [files];
            const response = await medusa.admin.upload.create({ files: filesToUpload });
            return response as { uploads: { url: string }[] };
        } catch (error: any) {
            console.error('Failed to upload files to Medusa:', error);
            throw new Error(error.message || 'Failed to upload files');
        }
    }

    /**
     * Delete an uploaded file by key
     * @param key Key of the file to delete
     */
    async delete(key: string): Promise<{ id: string, object: string, deleted: boolean }> {
        try {
            const response = await medusa.admin.upload.delete(key);
            return response as { id: string, object: string, deleted: boolean };
        } catch (error: any) {
            console.error(`Failed to delete file ${key} from Medusa:`, error);
            throw new Error(error.message || 'Failed to delete file');
        }
    }
}

export const uploadService = new UploadService();
