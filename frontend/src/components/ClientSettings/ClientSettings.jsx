import React, { useState, useEffect, useCallback } from 'react';
import { GeneralInfoSection } from './GeneralInfoSection';
import { BillingSection } from './BillingSection';
import { WorkflowSection } from './WorkflowSection';
import { PortalSection } from './PortalSection';
import { NotesContractsSection } from './NotesContractsSection';
import { ClientLivePreview } from './ClientLivePreview';
import { Toast } from '../common/Toast';
import {
  INITIAL_CLIENT_SETTINGS,
  PRESET_CLIENTS,
} from '../../constants/clientDefaults';
import {
  validateClientSettings,
  getSectionErrorCounts,
} from '../../utils/validation';
import './ClientSettings.css';

const STORAGE_KEY = 'freelance_pm_client_settings_draft';

const TABS = [
  { id: 'general', label: 'General Identity', icon: 'user' },
  { id: 'billing', label: 'Billing & Rates', icon: 'credit-card' },
  { id: 'workflow', label: 'Workflow & Revisions', icon: 'sliders' },
  { id: 'portal', label: 'Portal & Notifications', icon: 'bell' },
  { id: 'contracts', label: 'Legal & Notes', icon: 'file-text' },
];

export const ClientSettings = () => {
  const [formData, setFormData] = useState(() => {
    // Load from LocalStorage if draft exists, or default to first sample client
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return PRESET_CLIENTS[0];
  });

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toast, setToast] = useState(null);

  const sectionErrors = getSectionErrorCounts(errors);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Handle standard field change
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));

    // Clear field error on edit
    setErrors((prevErrors) => {
      if (!prevErrors[name]) return prevErrors;
      const updated = { ...prevErrors };
      delete updated[name];
      return updated;
    });
  }, []);

  // Handle direct value update (e.g. avatar picker)
  const handleDirectUpdate = useCallback((key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prevErrors) => {
      if (!prevErrors[key]) return prevErrors;
      const updated = { ...prevErrors };
      delete updated[key];
      return updated;
    });
  }, []);

  // Handle direct toggle change
  const handleToggleChange = useCallback((key, checked) => {
    setFormData((prev) => ({
      ...prev,
      [key]: checked,
    }));
  }, []);

  // Handle nested object property update (e.g. billingAddress.city, emailNotifications.invoiceCreated)
  const handleNestedChange = useCallback((parentKey, childKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  }, []);

  // Preset loader
  const handleLoadPreset = (presetId) => {
    const preset = PRESET_CLIENTS.find((p) => p.id === presetId);
    if (preset) {
      setFormData({ ...preset });
      setErrors({});
      setToast({
        type: 'info',
        message: `Loaded template: "${preset.companyName}"`,
      });
    }
  };

  // Reset to blank
  const handleResetBlank = () => {
    if (window.confirm('Reset all fields to blank template? Any unsaved changes will be lost.')) {
      setFormData(INITIAL_CLIENT_SETTINGS);
      setErrors({});
      setToast({
        type: 'info',
        message: 'Form cleared to empty client template.',
      });
    }
  };

  // Form submission / Save
  const handleSave = (e) => {
    if (e) e.preventDefault();

    const { isValid, errors: validationErrors } = validateClientSettings(formData);
    setErrors(validationErrors);

    if (!isValid) {
      // Find first section with error and switch tab
      const errorCounts = getSectionErrorCounts(validationErrors);
      if (errorCounts.general > 0) setActiveTab('general');
      else if (errorCounts.billing > 0) setActiveTab('billing');
      else if (errorCounts.workflow > 0) setActiveTab('workflow');
      else if (errorCounts.contracts > 0) setActiveTab('contracts');

      setToast({
        type: 'error',
        message: 'Please review and fix the highlighted validation errors.',
      });
      return;
    }

    setIsSaving(true);

    // Simulate saving to API / localStorage
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSaved(now);
        setIsSaving(false);
        setToast({
          type: 'success',
          message: `Client settings for "${formData.companyName}" saved successfully!`,
        });
      } catch {
        setIsSaving(false);
        setToast({
          type: 'error',
          message: 'Failed to persist settings to local storage.',
        });
      }
    }, 450);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${(formData.companyName || 'client-settings').toLowerCase().replace(/[^a-z0-9]/g, '-')}-settings.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToast({
      type: 'info',
      message: 'Client settings exported as JSON configuration.',
    });
  };

  // Import JSON
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        setFormData({ ...INITIAL_CLIENT_SETTINGS, ...importedData });
        setErrors({});
        setToast({
          type: 'success',
          message: `Successfully imported settings for "${importedData.companyName || 'Client'}"!`,
        });
      } catch {
        setToast({
          type: 'error',
          message: 'Invalid JSON configuration file.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const renderTabIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        );
      case 'bell':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="client-settings-page">
      {/* Toast Alert */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Controls Bar */}
      <div className="client-settings-header">
        <div className="header-info">
          <div className="header-breadcrumbs">
            <span>Clients</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {formData.companyName || 'New Client Profile'}
            </span>
          </div>
          <h1 className="header-title">Client Account Settings</h1>
          <p className="header-subtitle">
            Configure rates, billing preferences, communication channels, and portal rules for this client.
          </p>
        </div>

        <div className="header-actions">
          {/* Quick preset selector */}
          <div className="preset-selector-group">
            <span className="preset-label">Templates:</span>
            <select
              className="preset-select"
              onChange={(e) => {
                if (e.target.value === 'blank') handleResetBlank();
                else if (e.target.value) handleLoadPreset(e.target.value);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Client...
              </option>
              {PRESET_CLIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.presetName}
                </option>
              ))}
              <option value="blank">✨ Blank Template</option>
            </select>
          </div>

          <div className="import-export-btns">
            <label className="btn-secondary btn-icon" title="Import JSON settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
            </label>

            <button
              type="button"
              className="btn-secondary btn-icon"
              onClick={handleExportJSON}
              title="Export JSON settings"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Export</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-primary btn-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-dots" /> Saving...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {lastSaved && (
        <div className="last-saved-banner">
          <span className="saved-icon">✓</span> Last saved at {lastSaved}
        </div>
      )}

      {/* Main Layout Grid: Tabs + Form on Left, Live Preview Card on Right */}
      <div className="client-settings-body">
        <div className="settings-main-column">
          {/* Section Navigation Tabs */}
          <nav className="settings-tabs-nav" aria-label="Client Settings Sections">
            {TABS.map((tab) => {
              const count = sectionErrors[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item-btn ${activeTab === tab.id ? 'is-active' : ''}`}
                >
                  <span className="tab-icon">{renderTabIcon(tab.icon)}</span>
                  <span className="tab-label">{tab.label}</span>
                  {count > 0 && <span className="tab-error-badge">{count}</span>}
                </button>
              );
            })}
          </nav>

          {/* Form Content Panel */}
          <form onSubmit={handleSave} className="settings-form-panel" noValidate>
            {activeTab === 'general' && (
              <GeneralInfoSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onDirectUpdate={handleDirectUpdate}
              />
            )}

            {activeTab === 'billing' && (
              <BillingSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                onToggleChange={handleToggleChange}
              />
            )}

            {activeTab === 'workflow' && (
              <WorkflowSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onToggleChange={handleToggleChange}
              />
            )}

            {activeTab === 'portal' && (
              <PortalSection
                formData={formData}
                onChange={handleChange}
                onToggleChange={handleToggleChange}
                onNestedChange={handleNestedChange}
              />
            )}

            {activeTab === 'contracts' && (
              <NotesContractsSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onToggleChange={handleToggleChange}
              />
            )}

            {/* Bottom Form Actions Bar */}
            <div className="form-footer-actions">
              <div className="footer-left">
                <button
                  type="button"
                  className="btn-text-danger"
                  onClick={handleResetBlank}
                >
                  Reset Form
                </button>
              </div>

              <div className="footer-right">
                {activeTab !== 'general' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
                      if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
                    }}
                  >
                    ← Previous Tab
                  </button>
                )}

                {activeTab !== 'contracts' ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
                      if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1].id);
                    }}
                  >
                    Next Tab →
                  </button>
                ) : null}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live System Preview Sidebar */}
        <div className="settings-preview-column">
          <ClientLivePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};
