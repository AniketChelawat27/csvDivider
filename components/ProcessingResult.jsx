import React from 'react';

export function ProcessingResult({ result }) {
    // Handle multiple upload results
    if (result.type === "multiple_upload") {
        return (
            <div className="result-section">
                <h3 className="result-title">
                    ✅ Upload Complete!
                </h3>
                <div className="result-item">
                    <p className="result-stats">
                        Successfully uploaded {result.totalFiles} files
                    </p>
                    <div className="result-urls">
                        <p className="url-label">
                            <strong>Uploaded Files:</strong>
                        </p>
                        {result.uploadedFiles.map((file, index) => (
                            <div key={index} className="uploaded-file-result">
                                <p className="file-name">
                                    <strong>{file.name}</strong>
                                    {file.size && (
                                        <span className="file-size">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    )}
                                </p>
                                {file.link ? (
                                    <p className="url-text success">
                                        ✅ Uploaded: {file.link}
                                    </p>
                                ) : (
                                    <p className="url-text error">
                                        ❌ Upload failed: No link returned
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Handle CSV processing results (original functionality)
    return (
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
    );
} 