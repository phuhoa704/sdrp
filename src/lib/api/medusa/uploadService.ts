import bridgeClient from '../bridgeClient';
import axios from 'axios';

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

            const formData = new FormData();
            for (const file of filesToUpload) {
                formData.append('files', file);
            }

            const res = await bridgeClient.post('/admin/uploads', formData, {
                headers: {
                    // Override JSON default; axios will set proper boundary.
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data as { uploads: { url: string }[] };
        } catch (error: unknown) {
            console.error('Failed to upload files to Medusa:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to upload files'
            );
        }
    }

    /**
     * Delete an uploaded file by key
     * @param key Key of the file to delete
     */
    async delete(key: string): Promise<{ id: string, object: string, deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/uploads/${key}`);
            return res.data as { id: string, object: string, deleted: boolean };
        } catch (error: unknown) {
            console.error(`Failed to delete file ${key} from Medusa:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete file'
            );
        }
    }
}

export const uploadService = new UploadService();
