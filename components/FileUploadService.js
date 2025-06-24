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

    static async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new Error('No files provided for upload');
        }

        if (files.length > 20) {
            throw new Error('Maximum 20 files allowed for upload');
        }

        const requestPayload = new FormData();
        for (const file of files) {
            requestPayload.append("files", file);
        }

        console.log(`Uploading ${files.length} files to external API...`);
        console.log('Files:', files.map(f => f.name));

        const uploadResponse = await fetch(API_ENDPOINTS.EXTERNAL_UPLOAD, {
            method: 'POST',
            body: requestPayload
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('Multiple files upload response:', uploadData);

        // Transform response to match the expected format
        const attachments = [];
        
        // Handle different response formats
        let responseUrls = [];
        if (uploadData.urls && Array.isArray(uploadData.urls)) {
            responseUrls = uploadData.urls;
        } else if (uploadData.url) {
            responseUrls = [uploadData.url];
        } else if (Array.isArray(uploadData)) {
            responseUrls = uploadData;
        } else {
            throw new Error('Invalid response format from upload API');
        }

        // Create attachments array with file links and names
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const link = responseUrls[i] || null;
            
            attachments.push({
                link: link,
                name: file.name,
                size: file.size,
                type: file.type
            });
        }

        console.log(`✅ ${files.length} files uploaded successfully`);
        console.log('Uploaded files:', attachments);

        return {
            files: attachments,
            totalFiles: files.length,
            uploadResponse: uploadData
        };
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