import React from 'react';
import './ButtonTextWithLoading.css';

export function ButtonTextWithLoading({ text, isLoading, variant = 'dark' }) {
    return (
        <div className={`button-content ${variant}`}>
            {isLoading && (
                <div className="spinner"></div>
            )}
            <span className="button-text">
                {text}
            </span>
        </div>
    );
} 