import React from 'react';

const STATUS_CONFIG = {
  active: { label: 'Active', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', dot: '#10b981' },
  lead: { label: 'Lead / Prospect', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', dot: '#3b82f6' },
  on_hold: { label: 'On Hold', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', dot: '#f59e0b' },
  archived: { label: 'Archived', bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', dot: '#6b7280' },
};

const TIER_LABELS = {
  standard: 'Standard',
  vip: '⭐ VIP Client',
  retainer: '🔄 Retainer Partner',
  non_profit: '🌱 Non-Profit',
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  SGD: 'S$',
  CHF: 'CHF',
};

export const ClientLivePreview = ({ formData }) => {
  const statusInfo = STATUS_CONFIG[formData.status] || STATUS_CONFIG.active;
  const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || '$';

  const getInitials = (name) => {
    if (!name) return 'CL';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="preview-card-panel">
      <div className="preview-header-bar">
        <span className="preview-pill-badge">Live System Preview</span>
        <span className="preview-hint-text">Instant Card Rendering</span>
      </div>

      <div className="client-preview-card">
        {/* Top Banner & Status */}
        <div className="preview-card-top">
          <div className="preview-avatar-box">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt={formData.companyName || 'Client Avatar'}
                className="preview-avatar-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="preview-avatar-placeholder"
              style={{ display: formData.avatarUrl ? 'none' : 'flex' }}
            >
              {getInitials(formData.companyName || formData.contactName)}
            </div>
          </div>

          <div className="preview-identity">
            <h4 className="preview-company-name">
              {formData.companyName || 'Untitled Company'}
            </h4>
            {formData.tradingName && formData.tradingName !== formData.companyName && (
              <span className="preview-trading-name">aka {formData.tradingName}</span>
            )}
            <div className="preview-meta-badges">
              <span
                className="status-badge"
                style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
              >
                <span className="status-dot" style={{ backgroundColor: statusInfo.dot }} />
                {statusInfo.label}
              </span>
              <span className="tier-badge">{TIER_LABELS[formData.clientTier] || 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* Client Details List */}
        <div className="preview-details-grid">
          <div className="preview-detail-item">
            <span className="detail-label">Primary Contact</span>
            <span className="detail-value">{formData.contactName || '—'}</span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value detail-truncate" title={formData.contactEmail}>
              {formData.contactEmail || '—'}
            </span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Industry</span>
            <span className="detail-value">{formData.industry || 'General'}</span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Billing Model</span>
            <span className="detail-value text-capitalize">
              {formData.billingModel || 'Hourly'}
            </span>
          </div>

          <div className="preview-detail-item highlight-item">
            <span className="detail-label">Default Rate</span>
            <span className="detail-value rate-value">
              {currencySymbol}{formData.defaultHourlyRate || 0}
              <small>/hr</small>
            </span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Payment Terms</span>
            <span className="detail-value text-uppercase">
              {formData.paymentTerms?.replace('_', ' ') || 'Net 30'}
            </span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Primary Channel</span>
            <span className="detail-value">
              {formData.primaryCommunicationChannel}
              {formData.channelHandle ? ` (${formData.channelHandle})` : ''}
            </span>
          </div>

          <div className="preview-detail-item">
            <span className="detail-label">Timezone</span>
            <span className="detail-value detail-truncate" title={formData.timezone}>
              {formData.timezone?.split(' ')[0] || 'UTC'}
            </span>
          </div>
        </div>

        {/* Feature Tags & Policies */}
        <div className="preview-tags-section">
          <div className="preview-tags-title">Active Settings & Compliance</div>
          <div className="preview-tags-cloud">
            <span className={`policy-tag ${formData.enableClientPortal ? 'tag-enabled' : 'tag-disabled'}`}>
              {formData.enableClientPortal ? '✓ Portal Active' : '✕ Portal Disabled'}
            </span>
            <span className={`policy-tag ${formData.autoInvoice ? 'tag-enabled' : 'tag-disabled'}`}>
              {formData.autoInvoice ? '✓ Auto-Invoice' : '✕ Manual Invoice'}
            </span>
            <span className={`policy-tag ${formData.ndaSigned ? 'tag-enabled' : 'tag-warning'}`}>
              {formData.ndaSigned ? '✓ NDA Signed' : '⚠ NDA Pending'}
            </span>
            <span className="policy-tag tag-info">
              {formData.includedRevisions} Revisions Included
            </span>
          </div>
        </div>

        {/* Internal Note snippet if exists */}
        {formData.internalNotes && (
          <div className="preview-internal-note">
            <div className="note-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Internal Note Preview
            </div>
            <p className="note-text">{formData.internalNotes}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
