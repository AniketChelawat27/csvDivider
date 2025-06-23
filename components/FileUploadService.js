import { API_ENDPOINTS, FILE_TYPES } from '../constants/api';

// File upload service to handle external API interactions
export class FileUploadService {
    static async uploadFile(file) {
        const uploadFormData = new FormData();
        uploadFormData.append('files', file);

        console.log(`Uploading ${file.name} to external API...`);
        
        const uploadResponse = await fetch(API_ENDPOINTS.EXTERNAL_UPLOAD, {
            method: 'POST',
            body: uploadFormData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData);

        // Extract the uploaded file URL from the response
        let uploadedFileUrl;
        if (uploadData.urls && uploadData.urls.length > 0) {
            uploadedFileUrl = uploadData.urls[0];
        } else if (uploadData.url) {
            uploadedFileUrl = uploadData.url;
        } else if (Array.isArray(uploadData) && uploadData.length > 0) {
            uploadedFileUrl = uploadData[0];
        } else {
            throw new Error('No file URL returned from upload API');
        }

        console.log(`File uploaded successfully: ${uploadedFileUrl}`);
        return { uploadedFileUrl, uploadData };
    }

    static async uploadSplitFile(splitFile) {
        try {
            // Create a File object from the split file path
            const splitFileResponse = await fetch(`${API_ENDPOINTS.FILE_DOWNLOAD}/${splitFile.fileName}`);
            if (!splitFileResponse.ok) {
                throw new Error(`Failed to fetch split file: ${splitFileResponse.status}`);
            }
            
            const splitFileBlob = await splitFileResponse.blob();
            const splitFileObject = new File([splitFileBlob], splitFile.fileName, { type: FILE_TYPES.CSV.MIME_TYPE });
            
            // Upload the split file to external API
            const splitUploadFormData = new FormData();
            splitUploadFormData.append('files', splitFileObject);
            
            console.log(`Uploading split file: ${splitFile.fileName} to external API...`);
            
            const splitUploadResponse = await fetch(API_ENDPOINTS.EXTERNAL_UPLOAD, {
                method: 'POST',
                body: splitUploadFormData
            });
            
            if (!splitUploadResponse.ok) {
                throw new Error(`Split file upload failed: ${splitUploadResponse.status} ${splitUploadResponse.statusText}`);
            }
            
            const splitUploadData = await splitUploadResponse.json();
            console.log(`Split file upload response for ${splitFile.fileName}:`, splitUploadData);
            
            // Extract the uploaded URL for the split file
            let splitFileUploadedUrl;
            if (splitUploadData.urls && splitUploadData.urls.length > 0) {
                splitFileUploadedUrl = splitUploadData.urls[0];
            } else if (splitUploadData.url) {
                splitFileUploadedUrl = splitUploadData.url;
            } else if (Array.isArray(splitUploadData) && splitUploadData.length > 0) {
                splitFileUploadedUrl = splitUploadData[0];
            } else {
                throw new Error('No file URL returned from split file upload API');
            }
            
            console.log(`✅ Split file ${splitFile.fileName} uploaded successfully: ${splitFileUploadedUrl}`);
            
            return {
                fileName: splitFile.fileName,
                recordCount: splitFile.recordCount,
                originalAwsUrl: splitFile.awsUrl,
                uploadedUrl: splitFileUploadedUrl,
                uploadResponse: splitUploadData
            };
            
        } catch (error) {
            console.error(`❌ Failed to upload split file ${splitFile.fileName}:`, error);
            return {
                fileName: splitFile.fileName,
                recordCount: splitFile.recordCount,
                originalAwsUrl: splitFile.awsUrl,
                error: error.message
            };
        }
    }
} 