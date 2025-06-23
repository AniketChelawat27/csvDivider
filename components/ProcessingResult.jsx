import React from 'react';

export function ProcessingResult({ result }) {
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
                        
                        {/* Display split file upload results */}
                        {item.splitFileUploads && item.splitFileUploads.length > 0 && (
                            <>
                                <p className="url-label">
                                    <strong>Split Files Upload Results:</strong>
                                </p>
                                {item.splitFileUploads.map((splitFile, splitIndex) => (
                                    <div key={splitIndex} className="split-file-result">
                                        <p className="split-file-name">
                                            <strong>{splitFile.fileName}</strong> 
                                            ({splitFile.recordCount} records)
                                        </p>
                                        {splitFile.uploadedUrl ? (
                                            <p className="url-text success">
                                                ✅ Uploaded: {splitFile.uploadedUrl}
                                            </p>
                                        ) : (
                                            <p className="url-text error">
                                                ❌ Upload failed: {splitFile.error}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
} 