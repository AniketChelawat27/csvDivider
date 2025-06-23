import React from 'react';

export function DivisionInput({ divideInto, setDivideInto }) {
    return (
        <div className="form-group">
            <label htmlFor="divideInto" className="form-label">
                Number of parts to divide into:
            </label>
            <input
                type="number"
                id="divideInto"
                value={divideInto}
                onChange={(e) => setDivideInto(parseInt(e.target.value))}
                className="form-input"
                style={{width:"93%"}}
            />
        </div>
    );
} 