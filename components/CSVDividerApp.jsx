import React, { useState } from 'react';
import { UploadFiles } from './UploadFiles';
import { DivisionInput } from './DivisionInput';
import { ProcessingResult } from './ProcessingResult';
import { AppHeader } from './AppHeader';
import { useFileProcessor } from '../hooks/useFileProcessor';
import { DEFAULT_VALUES } from '../constants/api';
import './CSVDividerApp.css';

export function CSVDividerApp() {
    const [divideInto, setDivideInto] = useState(DEFAULT_VALUES.DIVIDE_INTO);
    const { loading, result, error, processFiles } = useFileProcessor();

    const handleFileUpload = async (files) => {
        await processFiles(files, divideInto);
    };

    return (
        <div className="csv-divider-container">
            <div className="csv-divider-paper">
                <div className="csv-divider-content">
                    <AppHeader />

                    <div className="csv-divider-form">
                        <DivisionInput 
                            divideInto={divideInto} 
                            setDivideInto={setDivideInto} 
                        />

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

                        {result && <ProcessingResult result={result} />}
                    </div>
                </div>
            </div>
        </div>
    );
} 