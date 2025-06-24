import React, { useState } from 'react';
import { JDProjectService } from './JDProjectService';
import { BulkUploadService } from './BulkUploadService';

export function ProcessingResult({ result }) {
    const [creatingProjects, setCreatingProjects] = useState({});
    const [projectResults, setProjectResults] = useState({});
    const [bulkUploadResults, setBulkUploadResults] = useState({});

    const handleCreateProject = async (fileName, fileIndex, fileLink) => {
        setCreatingProjects(prev => ({ ...prev, [fileIndex]: true }));
        
        try {
            // Step 1: Create JD Project
            const projectResult = await JDProjectService.createProject(fileName);
            
            setProjectResults(prev => ({
                ...prev,
                [fileIndex]: { success: true, data: projectResult }
            }));
            console.log("projectResult", projectResult);
            // Step 2: Automatically start bulk upload if project creation was successful
            if (projectResult && projectResult?.data?._id) {
                try {
                    const bulkUploadResult = await BulkUploadService.bulkUploadCandidates(
                        projectResult?.data?._id,
                        fileLink,
                        fileName
                    );
                    
                    setBulkUploadResults(prev => ({
                        ...prev,
                        [fileIndex]: { success: true, data: bulkUploadResult }
                    }));
                } catch (bulkUploadError) {
                    setBulkUploadResults(prev => ({
                        ...prev,
                        [fileIndex]: { success: false, error: bulkUploadError.message }
                    }));
                }
            }
        } catch (error) {
            setProjectResults(prev => ({
                ...prev,
                [fileIndex]: { success: false, error: error.message }
            }));
        } finally {
            setCreatingProjects(prev => ({ ...prev, [fileIndex]: false }));
        }
    };

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
                        {result.uploadedFiles.map((file, index) => {
                            const isCreating = creatingProjects[index];
                            const projectResult = projectResults[index];
                            const bulkUploadResult = bulkUploadResults[index];
                            const isProjectCreated = projectResult && projectResult.success;
                            
                            return (
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
                                        <div className="file-upload-success">
                                            <p className="url-text success">
                                                ✅ Uploaded: {file.link}
                                            </p>
                                            <button
                                                className={`create-project-btn ${isCreating ? 'creating' : ''} ${isProjectCreated ? 'created' : ''}`}
                                                onClick={() => handleCreateProject(file.name, index, file.link)}
                                                disabled={isCreating || isProjectCreated}
                                            >
                                                {isCreating ? 'Creating Project...' : 
                                                 isProjectCreated ? 'Created Project' : 
                                                 'Create Project'}
                                            </button>
                                            {projectResult && (
                                                <div className={`project-result ${projectResult.success ? 'success' : 'error'}`}>
                                                    {projectResult.success ? (
                                                        <div>
                                                            <p>✅ Project created successfully!</p>
                                                            {bulkUploadResult && (
                                                                <div className={`bulk-upload-result ${bulkUploadResult.success ? 'success' : 'error'}`}>
                                                                    {bulkUploadResult.success ? (
                                                                        <p>✅ Candidates upload started!</p>
                                                                    ) : (
                                                                        <p>⚠️ Project created but candidate upload failed: {bulkUploadResult.error}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p>❌ Failed to create project: {projectResult.error}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="url-text error">
                                            ❌ Upload failed: No link returned
                                        </p>
                                    )}
                                </div>
                            );
                        })}
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
                            <strong>Download Divided CSV Files:</strong>
                        </p>
                        <div className="download-buttons">
                            {item?.result?.filesCreated?.map((file, fileIndex) => (
                                <div key={fileIndex} className="download-item">
                                    <span className="file-info">
                                        {file?.fileName} ({file?.recordCount} records)
                                    </span>
                                    <button
                                        className="download-btn"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = file.downloadUrl;
                                            link.download = file.fileName;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    >
                                        📥 Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 