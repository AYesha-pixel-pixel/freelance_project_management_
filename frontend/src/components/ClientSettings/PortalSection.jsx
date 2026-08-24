import React from 'react';
import { SelectField } from '../common/SelectField';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { PORTAL_ROLE_OPTIONS } from '../../constants/clientDefaults';

export const PortalSection = ({ formData, onToggleChange, onNestedChange, onChange }) => {
  const isPortalEnabled = formData.enableClientPortal;

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Client Portal & Notification Rules</h3>
        <p className="section-description">
          Configure client self-service portal access permissions and automated email notification triggers.
        </p>
      </div>

      <div className="portal-feature-banner">
        <div className="portal-banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <div className="portal-banner-text">
          <strong>Self-Service Client Portal</strong>
          <span>
            Allows client stakeholders to view real-time project progress, approve deliverables, and pay invoices online.
          </span>
        </div>
      </div>

      <div className="toggles-list">
        <ToggleSwitch
          id="enableClientPortal"
          name="enableClientPortal"
          label="Enable Dedicated Client Portal"
          description="Grant client access to their private dashboard URL to track project milestones."
          badge={formData.enableClientPortal ? 'Active' : 'Disabled'}
          checked={formData.enableClientPortal}
          onChange={(e) => onToggleChange('enableClientPortal', e.target.checked)}
        />
      </div>

      {isPortalEnabled && (
        <div className="portal-settings-block">
          <div className="form-grid form-grid-1">
            <SelectField
              label="Portal Access Permission Level"
              name="portalRole"
              value={formData.portalRole}
              onChange={onChange}
              options={PORTAL_ROLE_OPTIONS}
              helperText="Determines whether client can only view status or interact with approvals and comments"
            />
          </div>
        </div>
      )}

      <div className="section-divider" />

      <h4 className="subsection-title">Automated Notification Triggers</h4>
      <p className="subsection-subtitle">
        Select which automatic email notifications this client's contact persons will receive.
      </p>

      <div className="toggles-list">
        <ToggleSwitch
          id="notif_milestoneUpdates"
          name="milestoneUpdates"
          label="Milestone Progress & Completion Alerts"
          description="Send an instant email when a milestone status changes or is submitted for approval."
          checked={formData.emailNotifications?.milestoneUpdates ?? true}
          onChange={(e) => onNestedChange('emailNotifications', 'milestoneUpdates', e.target.checked)}
        />

        <ToggleSwitch
          id="notif_invoiceCreated"
          name="invoiceCreated"
          label="New Invoice & Payment Receipts"
          description="Send digital PDF invoices and automated payment confirmations."
          checked={formData.emailNotifications?.invoiceCreated ?? true}
          onChange={(e) => onNestedChange('emailNotifications', 'invoiceCreated', e.target.checked)}
        />

        <ToggleSwitch
          id="notif_taskComments"
          name="taskComments"
          label="Task Discussion & Mention Notifications"
          description="Notify client whenever their team is mentioned in task threads or review comments."
          checked={formData.emailNotifications?.taskComments ?? false}
          onChange={(e) => onNestedChange('emailNotifications', 'taskComments', e.target.checked)}
        />

        <ToggleSwitch
          id="notif_weeklyProgressDigest"
          name="weeklyProgressDigest"
          label="Weekly Executive Summary Digest"
          description="Send an automated Monday morning digest of hours logged, tasks completed, and upcoming deadlines."
          checked={formData.emailNotifications?.weeklyProgressDigest ?? true}
          onChange={(e) => onNestedChange('emailNotifications', 'weeklyProgressDigest', e.target.checked)}
        />
      </div>
    </div>
  );
};
