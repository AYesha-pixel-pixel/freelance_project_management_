import React from 'react';

/**
 * Reusable form input component with labels, errors, prefixes/suffixes, and helper text.
 */
export const InputField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  prefix = null,
  suffix = null,
  disabled = false,
  min,
  max,
  step,
  rows,
  as = 'input',
  className = '',
}) => {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true">*</span>}
        </label>
      )}

      <div className={`input-wrapper ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}

        <Component
          id={id || name}
          name={name}
          type={as === 'textarea' ? undefined : type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          rows={rows}
          className="form-control"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-help` : undefined}
        />

        {suffix && <span className="input-suffix">{suffix}</span>}
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
