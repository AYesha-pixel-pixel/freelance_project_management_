import React from 'react';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import {
  INDUSTRY_OPTIONS,
  STATUS_OPTIONS,
  TIER_OPTIONS,
} from '../../constants/clientDefaults';

const AVATAR_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
];

export const GeneralInfoSection = ({ formData, errors, onChange, onDirectUpdate }) => {
  const handleAvatarSelect = (url) => {
    onDirectUpdate('avatarUrl', url);
  };

  const getInitials = (name) => {
    if (!name) return 'CL';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Client Identity & Profile</h3>
        <p className="section-description">
          Manage general company details, primary contact points, branding avatar, and client categorization.
        </p>
      </div>

      {/* Avatar & Branding Header */}
      <div className="avatar-selection-card">
        <div className="avatar-preview-wrap">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt={formData.companyName || 'Client Avatar'}
              className="client-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="client-avatar-fallback"
            style={{ display: formData.avatarUrl ? 'none' : 'flex' }}
          >
            {getInitials(formData.companyName || formData.contactName)}
          </div>
        </div>

        <div className="avatar-info-col">
          <div className="avatar-title-row">
            <span className="avatar-label">Client Logo / Avatar</span>
            <span className="avatar-hint">Enter an image URL or choose a preset below</span>
          </div>

          <div className="avatar-url-input-row">
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl || ''}
              onChange={onChange}
              placeholder="https://example.com/logo.png"
              className="form-control form-control-sm"
            />
            {formData.avatarUrl && (
              <button
                type="button"
                className="btn-link-sm"
                onClick={() => onDirectUpdate('avatarUrl', '')}
              >
                Remove
              </button>
            )}
          </div>

          <div className="preset-avatars-row">
            <span className="preset-text">Presets:</span>
            {AVATAR_SUGGESTIONS.map((preset, idx) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAvatarSelect(preset)}
                className={`preset-avatar-btn ${formData.avatarUrl === preset ? 'is-selected' : ''}`}
                title={`Preset ${idx + 1}`}
              >
                <img src={preset} alt={`Preset ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-grid form-grid-2">
        <InputField
          label="Legal Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          placeholder="e.g. Acme Innovations Corp"
          required
          error={errors.companyName}
          helperText="Official registered organization name used on invoices"
        />

        <InputField
          label="Short / Brand Name"
          name="tradingName"
          value={formData.tradingName}
          onChange={onChange}
          placeholder="e.g. Acme"
          helperText="Display name shown across project dashboards and boards"
        />

        <InputField
          label="Primary Contact Name"
          name="contactName"
          value={formData.contactName}
          onChange={onChange}
          placeholder="e.g. Sarah Jenkins"
          required
          error={errors.contactName}
          helperText="Main point of contact for project communications"
        />

        <InputField
          label="Contact Email"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={onChange}
          placeholder="s.jenkins@acme.com"
          required
          error={errors.contactEmail}
          helperText="Primary email for updates and deliverable notifications"
        />

        <InputField
          label="Phone Number"
          name="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={onChange}
          placeholder="+1 (555) 000-0000"
          helperText="Optional phone or direct line"
        />

        <InputField
          label="Company Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          placeholder="https://acme.com"
          error={errors.website}
          prefix="https://"
        />

        <SelectField
          label="Industry / Domain"
          name="industry"
          value={formData.industry}
          onChange={onChange}
          options={INDUSTRY_OPTIONS}
          helperText="Helps categorize projects and benchmark hourly rates"
        />

        <SelectField
          label="Client Relationship Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          options={STATUS_OPTIONS}
          helperText="Active clients show in default project creation dropdowns"
        />

        <SelectField
          label="Client Tier / Priority"
          name="clientTier"
          value={formData.clientTier}
          onChange={onChange}
          options={TIER_OPTIONS}
          helperText="Assign VIP or Retainer priority for SLA and response timing"
        />
      </div>
    </div>
  );
};
