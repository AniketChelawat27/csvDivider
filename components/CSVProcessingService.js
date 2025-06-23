import { API_ENDPOINTS, FILE_TYPES } from '../constants/api';

// CSV processing service to handle file division logic
export class CSVProcessingService {
    static async processFile(file, divideInto, uploadedUrl) {
        const processFormData = new FormData();
        processFormData.append('csvFile', file);
        processFormData.append('divideInto', divideInto);
        processFormData.append('uploadedUrl', uploadedUrl);

        console.log(`Processing ${file.name} through CSV divider...`);

        const processResponse = await fetch(API_ENDPOINTS.CSV_DIVIDER, {
            method: 'POST',
            body: processFormData
        });

        if (!processResponse.ok) {
            throw new Error(`Processing failed: ${processResponse.status} ${processResponse.statusText}`);
        }

        const processData = await processResponse.json();

        if (!processData.success) {
            throw new Error(processData.error || 'Failed to process file');
        }

        return processData;
    }

    static async uploadSplitFiles(filesCreated) {
        console.log(`\n=== Uploading ${filesCreated.length} split files to external API ===`);
        
        const splitFileUploads = [];
        
        for (const splitFile of filesCreated) {
            const uploadResult = await this.uploadSplitFile(splitFile);
            splitFileUploads.push(uploadResult);
        }
        
        console.log(`\n=== Summary of split file uploads ===`);
        console.log(`Total split files: ${filesCreated.length}`);
        console.log(`Successfully uploaded: ${splitFileUploads.filter(f => f.uploadedUrl).length}`);
        console.log(`Failed uploads: ${splitFileUploads.filter(f => f.error).length}`);
        
        return splitFileUploads;
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