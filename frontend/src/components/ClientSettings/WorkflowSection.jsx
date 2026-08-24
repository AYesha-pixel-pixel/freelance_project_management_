import React from 'react';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { ToggleSwitch } from '../common/ToggleSwitch';
import {
  COMMUNICATION_CHANNELS,
  TIMEZONE_OPTIONS,
} from '../../constants/clientDefaults';

export const WorkflowSection = ({ formData, errors, onChange, onToggleChange }) => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Workflow, Revisions & Communications</h3>
        <p className="section-description">
          Define working timezone alignments, communication channels, revision limits, and asset management URLs.
        </p>
      </div>

      <div className="form-grid form-grid-2">
        <SelectField
          label="Client Working Timezone"
          name="timezone"
          value={formData.timezone}
          onChange={onChange}
          options={TIMEZONE_OPTIONS}
          helperText="Used to calculate working hours overlap and schedule deliverable deadlines"
        />

        <SelectField
          label="Primary Communication Channel"
          name="primaryCommunicationChannel"
          value={formData.primaryCommunicationChannel}
          onChange={onChange}
          options={COMMUNICATION_CHANNELS}
          helperText="Preferred platform for daily check-ins and asynchronous updates"
        />

        <InputField
          label="Channel Link or Handle"
          name="channelHandle"
          value={formData.channelHandle}
          onChange={onChange}
          placeholder="e.g. #client-project-sync or @contact_handle"
          helperText="Direct channel name, server link, or team handle"
        />

        <InputField
          label="Asset & Resource Hub URL"
          name="assetHubUrl"
          type="url"
          value={formData.assetHubUrl}
          onChange={onChange}
          placeholder="https://drive.google.com/... or Figma link"
          error={errors.assetHubUrl}
          helperText="Shared Google Drive, Figma, or Notion space for client assets"
        />

        <InputField
          label="Included Revisions per Milestone"
          name="includedRevisions"
          type="number"
          min="0"
          step="1"
          value={formData.includedRevisions}
          onChange={onChange}
          suffix="rounds"
          error={errors.includedRevisions}
          helperText="Standard review iterations included before additional charges"
        />

        <InputField
          label="Extra Revision Hourly Surcharge"
          name="extraRevisionRate"
          type="number"
          min="0"
          step="1"
          value={formData.extraRevisionRate}
          onChange={onChange}
          prefix="$"
          suffix="/ hr"
          error={errors.extraRevisionRate}
          helperText="Rate charged for revisions requested beyond the agreed limit"
        />

        <InputField
          label="Deadline Proximity Alert Buffer"
          name="deadlineBufferDays"
          type="number"
          min="0"
          step="1"
          value={formData.deadlineBufferDays}
          onChange={onChange}
          suffix="days"
          error={errors.deadlineBufferDays}
          helperText="Trigger impending deadline notifications this many days before due date"
        />
      </div>

      <div className="section-divider" />

      <h4 className="subsection-title">Scope & Approval Policies</h4>

      <div className="toggles-list">
        <ToggleSwitch
          id="requireScopeApproval"
          name="requireScopeApproval"
          label="Strict Scope Approval Gate"
          description="Require written or portal signoff from the client before beginning new sprints or out-of-scope work."
          checked={formData.requireScopeApproval}
          onChange={(e) => onToggleChange('requireScopeApproval', e.target.checked)}
        />
      </div>
    </div>
  );
};
