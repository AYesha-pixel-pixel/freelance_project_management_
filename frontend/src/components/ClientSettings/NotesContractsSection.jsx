import React from 'react';
import { InputField } from '../common/InputField';
import { ToggleSwitch } from '../common/ToggleSwitch';

export const NotesContractsSection = ({
  formData,
  errors,
  onChange,
  onToggleChange,
}) => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Legal Agreements & Internal Notes</h3>
        <p className="section-description">
          Keep track of Non-Disclosure Agreements (NDA), service contracts, and private operational notes.
        </p>
      </div>

      <div className="form-grid form-grid-2">
        <div className="grid-full-width">
          <ToggleSwitch
            id="ndaSigned"
            name="ndaSigned"
            label="Non-Disclosure Agreement (NDA) Executed"
            description="Toggle on if a signed bilateral or unilateral NDA is active for this client relationship."
            badge={formData.ndaSigned ? 'Signed' : 'Pending / None'}
            checked={formData.ndaSigned}
            onChange={(e) => onToggleChange('ndaSigned', e.target.checked)}
          />
        </div>

        {formData.ndaSigned && (
          <InputField
            label="NDA Execution Date"
            name="ndaSignedDate"
            type="date"
            value={formData.ndaSignedDate || ''}
            onChange={onChange}
            helperText="Date when the NDA was signed"
          />
        )}

        <div className={formData.ndaSigned ? '' : 'grid-full-width'}>
          <InputField
            label="Master Contract / SOW Document Link"
            name="contractAgreementUrl"
            type="url"
            value={formData.contractAgreementUrl || ''}
            onChange={onChange}
            placeholder="https://app.docusign.com/... or PandaDoc / Drive"
            error={errors.contractAgreementUrl}
            helperText="Direct link to signed Statement of Work (SOW) or Master Services Agreement"
          />
        </div>
      </div>

      <div className="section-divider" />

      <h4 className="subsection-title">Freelancer Private Notes & Preferences</h4>
      <p className="subsection-subtitle">
        These notes are completely private and never visible to the client or portal users.
      </p>

      <div className="form-grid form-grid-1">
        <InputField
          as="textarea"
          rows={5}
          label="Internal Observations & Workflow Quirks"
          name="internalNotes"
          value={formData.internalNotes || ''}
          onChange={onChange}
          placeholder="e.g. Client prefers async Figma reviews over meetings. Usually approves invoices on the 1st of every month. Key stakeholder Sarah goes on leave in August."
          helperText="Use this area to record communication styles, preferred meeting times, or special billing instructions."
        />
      </div>
    </div>
  );
};
