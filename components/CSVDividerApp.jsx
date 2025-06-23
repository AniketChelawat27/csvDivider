import React, { useState } from 'react';
import { UploadFiles } from './UploadFiles';
import './CSVDividerApp.css';

export function CSVDividerApp() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [divideInto, setDivideInto] = useState(2);

    const handleFileUpload = async (files) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Files to be uploaded:', files.map(f => f.name));
            
            const results = [];
            
            for (const file of files) {
                // Step 1: Upload file to external API
                const uploadFormData = new FormData();
                uploadFormData.append('files', file);

                console.log(`Uploading ${file.name} to external API...`);
                
                const uploadResponse = await fetch('https://easysource-uat.hirequotient.com/api/upload/files', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
                }

                const uploadData = await uploadResponse.json();
                console.log('Upload response:', uploadData);

                // Extract the uploaded file URL from the response
                // Assuming the API returns an array of URLs or a single URL
                let uploadedFileUrl;
                if (uploadData.urls && uploadData.urls.length > 0) {
                    uploadedFileUrl = uploadData.urls[0]; // Take the first URL
                } else if (uploadData.url) {
                    uploadedFileUrl = uploadData.url;
                } else if (Array.isArray(uploadData) && uploadData.length > 0) {
                    uploadedFileUrl = uploadData[0];
                } else {
                    throw new Error('No file URL returned from upload API');
                }

                console.log(`File uploaded successfully: ${uploadedFileUrl}`);

                // Step 2: Process the uploaded file through CSV divider
                const processFormData = new FormData();
                processFormData.append('csvFile', file); // We still need the file for processing
                processFormData.append('divideInto', divideInto);
                processFormData.append('uploadedUrl', uploadedFileUrl); // Pass the uploaded URL

                console.log(`Processing ${file.name} through CSV divider...`);

                const processResponse = await fetch('/api/divide-csv', {
                    method: 'POST',
                    body: processFormData
                });

                if (!processResponse.ok) {
                    throw new Error(`Processing failed: ${processResponse.status} ${processResponse.statusText}`);
                }

                const processData = await processResponse.json();

                if (processData.success) {
                    results.push({
                        originalFile: file.name,
                        uploadedUrl: uploadedFileUrl,
                        result: processData
                    });

                    // Log the divided CSV URLs
                    console.log(`\nFile: ${file.name}`);
                    console.log('Original uploaded URL:', uploadedFileUrl);
                    console.log('Divided CSV URLs:');
                    processData.filesCreated.forEach((file, fileIndex) => {
                        console.log(`  Part ${fileIndex + 1}: ${file.awsUrl}`);
                    });
                } else {
                    throw new Error(processData.error || 'Failed to process file');
                }
            }

            setResult(results);
            
        } catch (err) {
            setError(err.message || 'An error occurred while processing files');
            console.error('Error processing files:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="csv-divider-container">
            <div className="csv-divider-paper">
                <div className="csv-divider-content">
                    <div className="csv-divider-header">
                        <h1 className="csv-divider-title">
                            CSV Divider
                        </h1>
                        <p className="csv-divider-subtitle">
                            Split your large CSV files into smaller, manageable part
                        </p>
                    </div>

                    <div className="csv-divider-form">
                        <div className="form-group">
                            <label htmlFor="divideInto" className="form-label">
                                Number of parts to divide into:
                            </label>
                            <input
                                type="number"
                                id="divideInto"
                                value={divideInto}
                                onChange={(e) => setDivideInto(parseInt(e.target.value))}
                                // min="2"
                                // max="100"
                                className="form-input"
                                style={{width:"93%"}}
                            />
                        </div>

                        <UploadFiles
                            onSubmit={handleFileUpload}
                            submitText="Upload & Process CSV File"
                            loading={loading}
                        />

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="result-section">
                                <h3 className="result-title">
                                    ✅ Processing Complete!
                                </h3>
                                {result.map((item, index) => (
                                    <div key={index} className="result-item">
                                        <h4 className="result-file-name">
                                            {item.originalFile}
                                        </h4>
                                        <p className="result-stats">
                                            Total records: {item.result.totalRecords} | 
                                            Records per file: {item.result.recordsPerFile}
                                        </p>
                                        <p className="result-stats">
                                            Created {item.result.filesCreated.length} files
                                        </p>
                                        <div className="result-urls">
                                            <p className="url-label">
                                                <strong>Original Uploaded URL:</strong>
                                            </p>
                                            <p className="url-text">
                                                {item.uploadedUrl}
                                            </p>
                                            <p className="url-label">
                                                <strong>Divided CSV URLs:</strong>
                                            </p>
                                            {item.result.filesCreated.map((file, fileIndex) => (
                                                <p key={fileIndex} className="url-text">
                                                    {file.awsUrl}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 