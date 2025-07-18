import React, { useState } from "react";
import { UploadFiles } from "./UploadFiles";
import { DivisionInput } from "./DivisionInput";
import { TitleInput } from "./TitleInput";
import { ProcessingResult } from "./ProcessingResult";
import { AppHeader } from "./AppHeader";
import { useFileProcessor } from "../hooks/useFileProcessor";
import { DEFAULT_VALUES } from "../constants/api";
import "./CSVDividerApp.css";

export function CSVDividerApp() {
  const [divideInto, setDivideInto] = useState(DEFAULT_VALUES.DIVIDE_INTO);
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("split"); // "split" or "upload"
  const { loading, result, error, processFiles, processMultipleFiles, reset } =
    useFileProcessor();

  const handleFileUpload = async (files) => {
    await processFiles(files, divideInto);
  };

  const handleAWSUpload = async (files) => {
    await processMultipleFiles(files, title);
  };

  return (
    <div className="csv-divider-container">
      <div className="csv-divider-paper">
        <div className="csv-divider-content">
          <AppHeader />

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "split" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("split");
                reset();
              }}
            >
              Split CSV
            </button>
            <button
              className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("upload");
                reset();
              }}
            >
              Upload CSV
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "split" && (
              <div className="csv-divider-form">
                <DivisionInput
                  divideInto={divideInto}
                  setDivideInto={setDivideInto}
                />

                <UploadFiles
                  onSubmit={handleFileUpload}
                  submitText="Split this CSV"
                  loading={loading}
                  multiple={false}
                  excludeDoc
                  excludeDocx
                  excludePdf
                  excludeZip
                />

                {error && <div className="alert alert-error">{error}</div>}

                {result && <ProcessingResult result={result} title={title} />}
              </div>
            )}

            {activeTab === "upload" && (
              <div className="csv-divider-form">
                <TitleInput title={title} setTitle={setTitle} />
                
                {!title.trim() && (
                  <div className="alert alert-info">
                    Please enter a project title to continue
                  </div>
                )}

                <UploadFiles
                  onSubmit={handleAWSUpload}
                  submitText="Upload Files"
                  loading={loading}
                  disabled={!title.trim()}
                  excludeCsv={false}
                  excludePdf
                  excludeZip
                  excludeDoc
                  excludeDocx
                />

                {error && <div className="alert alert-error">{error}</div>}

                {result && <ProcessingResult result={result} title={title} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
