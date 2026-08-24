import React from 'react';

/**
 * Modern toggle switch component with title and helper description.
 */
export const ToggleSwitch = ({
  id,
  name,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  badge = null,
  className = '',
}) => {
  return (
    <label
      htmlFor={id || name}
      className={`toggle-container ${checked ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
    >
      <div className="toggle-text-block">
        <div className="toggle-label-row">
          <span className="toggle-title">{label}</span>
          {badge && <span className="toggle-badge">{badge}</span>}
        </div>
        {description && <span className="toggle-description">{description}</span>}
      </div>

      <div className="toggle-switch-wrapper">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="toggle-checkbox"
          role="switch"
          aria-checked={checked}
        />
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
      </div>
    </label>
  );
};
