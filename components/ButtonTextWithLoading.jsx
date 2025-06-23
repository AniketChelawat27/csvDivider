import React from 'react';
import './ButtonTextWithLoading.css';

export function ButtonTextWithLoading({ text, isLoading, variant = 'light' }) {
    return (
        <div className={`button-content ${variant}`}>
            {isLoading && (
                <div className="spinner"  style={{marginLeft:"10px"}}></div>
            )}
            <span className="button-text" style={{marginLeft:"10px"}}>
                {text}
            </span>
        </div>
    );
} 