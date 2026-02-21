import { client } from '../api/client';
import { ENDPOINTS } from '../api/constants';
import { API_BASE_URL } from '../api/constants';

export type ExportFormat = 'json' | 'csv' | 'pdf';

export interface ImportResult {
    success: boolean;
    message: string;
    results?: {
        [key: string]: {
            imported: number;
            errors: string[];
        };
    };
}

/**
 * Export Service
 * Handles all API calls related to data export and import
 */
export const exportService = {
    /**
     * Export user data in specified format
     * @param format - Export format (json, csv, or pdf)
     * @returns Promise that resolves when download starts
     */
    async exportData(format: ExportFormat): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EXPORT_DATA}${format}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': format === 'pdf' ? 'application/pdf' : 
                             format === 'csv' ? 'application/zip' : 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Export failed: ${response.statusText}`);
            }

            // Get the filename from the Content-Disposition header or create one
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `tracker_data.${format === 'csv' ? 'zip' : format}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export data:', error);
            throw error;
        }
    },

    /**
     * Import data from JSON file
     * @param file - JSON file to import
     * @returns Promise with import results
     */
    async importFromJSON(file: File): Promise<ImportResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await client.postFormData<ImportResult>(
                `${ENDPOINTS.IMPORT_DATA}json/`,
                formData,
                { 'Content-Type': 'multipart/form-data' } as Record<string, string>
            );

            return response;
        } catch (error) {
            console.error('Failed to import JSON data:', error);
            throw error;
        }
    },

    /**
     * Import data from CSV zip file
     * @param file - ZIP file containing CSV files
     * @returns Promise with import results
     */
    async importFromCSV(file: File): Promise<ImportResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await client.postFormData<ImportResult>(
                `${ENDPOINTS.IMPORT_DATA}csv/`,
                formData,
                { 'Content-Type': 'multipart/form-data' } as Record<string, string>
            );

            return response;
        } catch (error) {
            console.error('Failed to import CSV data:', error);
            throw error;
        }
    },

    /**
     * Validate file before import
     * @param file - File to validate
     * @param format - Expected format
     * @returns Validation result
     */
    validateFile(file: File, format: ExportFormat): { valid: boolean; error?: string } {
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return { valid: false, error: 'File size must be less than 10MB' };
        }

        // Check file extension
        const expectedExtensions = {
            json: ['.json'],
            csv: ['.zip'],
            pdf: ['.pdf']
        };

        const validExtensions = expectedExtensions[format];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!validExtensions.includes(fileExtension || '')) {
            return { 
                valid: false, 
                error: `Invalid file format. Expected: ${validExtensions.join(', ')}` 
            };
        }

        return { valid: true };
    },

    /**
     * Get supported export formats
     * @returns Array of supported formats
     */
    getSupportedFormats(): { value: ExportFormat; label: string; description: string }[] {
        return [
            {
                value: 'json',
                label: 'JSON',
                description: 'Export all data as a structured JSON file'
            },
            {
                value: 'csv',
                label: 'CSV',
                description: 'Export data as separate CSV files in a ZIP archive'
            },
            {
                value: 'pdf',
                label: 'PDF Report',
                description: 'Export a summary report as a PDF document'
            }
        ];
    }
};