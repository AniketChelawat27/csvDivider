import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileTile } from './FileTile';
import { ButtonTextWithLoading } from './ButtonTextWithLoading';
import './UploadFiles.css';

const baseStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const focusedStyle = {
    borderColor: "#0891B2",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

export function UploadFiles({
    onSubmit,
    submitText = "Divide CSV Files",
    loading = false,
    excludeCsv = false,
}) {
    const [myFiles, setMyFiles] = useState([]);
    
    const onDrop = useCallback((acceptedFiles) => {
        setMyFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);

    const removeFile = (file) => () => {
        setMyFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile !== file));
    };

    // Build accept object for CSV files
    const acceptedFileTypes = useMemo(() => {
        if (excludeCsv) return {};
        
        return {
            "text/csv": [".csv"],
            "application/csv": [".csv"],
        };
    }, [excludeCsv]);

    // Get the supported formats for display
    const supportedFormats = useMemo(() => {
        if (excludeCsv) return "No file types supported";
        return ".csv";
    }, [excludeCsv]);

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
        accept: acceptedFileTypes,
        multiple: true,
        maxFiles: 5,
        maxSize: 100000000, // 100MB
        onDrop,
    });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const files = myFiles.map((file) => {
        return <FileTile key={file.size} name={file.name} handleRemove={removeFile(file)} />;
    });

    const handleSubmit = () => {
        onSubmit(myFiles);
    };

    return (
        <div className="upload-files-container">
            <div {...getRootProps({ style })} className="upload-area">
                <input {...getInputProps()} />
                <div className="upload-content">
                    <div className="upload-icon">
                        📁
                    </div>
                    <h4 className="upload-text">
                        Drop your {supportedFormats} files here, or{" "}
                        <button className="browse-button">
                            Browse
                        </button>
                    </h4>
                    <p className="upload-subtext">
                        Supports: {supportedFormats}
                    </p>
                </div>
            </div>
            {onSubmit && (
                <div className="upload-actions">
                    <button
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={!files?.length || loading}
                    >
                        <ButtonTextWithLoading text={submitText} isLoading={loading} variant="light" />
                    </button>
                    <div className="files-list">
                        {files}
                    </div>
                </div>
            )}
        </div>
    );
} 