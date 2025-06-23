import { useState } from 'react';
import { FileUploadService } from '../components/FileUploadService';
import { CSVProcessingService } from '../components/CSVProcessingService';

export function useFileProcessor() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const processFiles = async (files, divideInto) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Files to be uploaded:', files.map(f => f.name));
            
            const results = [];
            
            for (const file of files) {
                // Step 1: Upload file to external API
                const { uploadedFileUrl } = await FileUploadService.uploadFile(file);

                // Step 2: Process the uploaded file through CSV divider
                const processData = await CSVProcessingService.processFile(file, divideInto, uploadedFileUrl);

                // Step 3: Upload the generated split files to external API
                const splitFileUploads = await CSVProcessingService.uploadSplitFiles(processData.filesCreated);

                results.push({
                    originalFile: file.name,
                    uploadedUrl: uploadedFileUrl,
                    result: processData,
                    splitFileUploads: splitFileUploads
                });

                // Log the divided CSV URLs
                console.log(`\nFile: ${file.name}`);
                console.log('Original uploaded URL:', uploadedFileUrl);
                console.log('Divided CSV URLs:');
                processData.filesCreated.forEach((file, fileIndex) => {
                    console.log(`  Part ${fileIndex + 1}: ${file.awsUrl}`);
                });
            }

            setResult(results);
            
        } catch (err) {
            setError(err.message || 'An error occurred while processing files');
            console.error('Error processing files:', err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setResult(null);
        setError(null);
    };

    return {
        loading,
        result,
        error,
        processFiles,
        reset
    };
} 