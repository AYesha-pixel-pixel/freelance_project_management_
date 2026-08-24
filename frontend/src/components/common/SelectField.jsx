import React from 'react';

/**
 * Reusable dropdown select component with options, labels, and validation feedback.
 */
export const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  helperText = '',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          id={id || name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className="form-control form-select"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-help` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={`${name}-error`} className="form-error" role="alert">
          <svg className="error-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${name}-help`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
