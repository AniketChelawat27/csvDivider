import React from 'react';
import './FileTile.css';

export function FileTile({ name, handleRemove }) {
    return (
        <div className="file-tile">
            <span className="file-name">
                {name}
            </span>
            <button
                className="remove-button"
                onClick={handleRemove}
                type="button"
            >
                ✕
            </button>
        </div>
    );
} 