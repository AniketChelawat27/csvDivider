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
    excludePdf = false,
    excludeZip = false,
    excludeDoc = false,
    excludeDocx = false,
    multiple = true,
}) {
    const [myFiles, setMyFiles] = useState([]);
    
    const onDrop = useCallback((acceptedFiles) => {
        if (multiple) {
            setMyFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        } else {
            // For single file mode, replace the existing file
            setMyFiles(acceptedFiles);
        }
    }, [multiple]);

    const removeFile = (file) => () => {
        setMyFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile !== file));
    };

    // Build accept object based on exclusion flags
    const acceptedFileTypes = useMemo(() => {
        const acceptTypes = {};
        
        if (!excludeCsv) {
            acceptTypes["text/csv"] = [".csv"];
            acceptTypes["application/csv"] = [".csv"];
        }
        
        if (!excludeZip) {
            acceptTypes["application/zip"] = [".zip"];
        }
        
        if (!excludePdf) {
            acceptTypes["application/pdf"] = [".pdf"];
        }
        
        if (!excludeDoc) {
            acceptTypes["application/msword"] = [".doc"];
        }
        
        if (!excludeDocx) {
            acceptTypes["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = [".docx"];
        }
        
        return acceptTypes;
    }, [excludeCsv, excludePdf, excludeZip, excludeDoc, excludeDocx]);

    // Get the supported formats for display
    const supportedFormats = useMemo(() => {
        const formats = [];
        if (!excludeCsv) formats.push(".csv");
        if (!excludePdf) formats.push(".pdf");
        if (!excludeDocx) formats.push(".docx");
        if (!excludeDoc) formats.push(".doc");
        if (!excludeZip) formats.push(".zip");
        return formats.length > 0 ? formats.join(", ") : "No file types supported";
    }, [excludeCsv, excludePdf, excludeDocx, excludeDoc, excludeZip]);

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
        accept: acceptedFileTypes,
        multiple: multiple,
        maxFiles: multiple ? 20 : 1,
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
                        Drop your {supportedFormats} {multiple ? 'files' : 'file'} here, or{" "}
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