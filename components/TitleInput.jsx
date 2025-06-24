import React from "react";

export function TitleInput({ title, setTitle }) {
  return (
    <div className="form-group">
      <label htmlFor="title" className="form-label">
        Project Title
      </label>
      <input
        type="text"
        id="title"
        className="form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter project title"
        required
        style={{width:"93%"}}
      />
      <small className="form-help">
        This title will be used as a prefix for your uploaded files
      </small>
    </div>
  );
} 