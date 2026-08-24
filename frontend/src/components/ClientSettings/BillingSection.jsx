import React from 'react';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { ToggleSwitch } from '../common/ToggleSwitch';
import {
  BILLING_MODEL_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
} from '../../constants/clientDefaults';

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

export const BillingSection = ({ formData, errors, onChange, onNestedChange, onToggleChange }) => {
  const currentSymbol = CURRENCY_SYMBOLS[formData.currency] || '$';

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Billing, Invoicing & Rates</h3>
        <p className="section-description">
          Set default hourly and project rates, payment terms, tax information, and automated invoicing rules.
        </p>
      </div>

      <div className="form-grid form-grid-2">
        <SelectField
          label="Default Invoicing Currency"
          name="currency"
          value={formData.currency}
          onChange={onChange}
          options={CURRENCY_OPTIONS}
          helperText="All proposals, time logs, and invoices will default to this currency"
        />

        <SelectField
          label="Default Billing Model"
          name="billingModel"
          value={formData.billingModel}
          onChange={onChange}
          options={BILLING_MODEL_OPTIONS}
          helperText="Primary compensation model agreed with this client"
        />

        <InputField
          label="Default Hourly Rate"
          name="defaultHourlyRate"
          type="number"
          min="0"
          step="1"
          value={formData.defaultHourlyRate}
          onChange={onChange}
          prefix={currentSymbol}
          suffix="/ hr"
          error={errors.defaultHourlyRate}
          helperText="Applied when creating new hourly contracts or logging billable hours"
        />

        <InputField
          label="Default / Target Project Budget"
          name="defaultProjectBudget"
          type="number"
          min="0"
          step="50"
          value={formData.defaultProjectBudget}
          onChange={onChange}
          prefix={currentSymbol}
          error={errors.defaultProjectBudget}
          helperText="Baseline budget for new fixed or milestone-based contracts"
        />

        <SelectField
          label="Payment Terms"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={onChange}
          options={PAYMENT_TERMS_OPTIONS}
          helperText="Invoice due date window calculated from issuance date"
        />

        <InputField
          label="Tax ID / VAT Number"
          name="taxId"
          value={formData.taxId}
          onChange={onChange}
          placeholder="e.g. US-123456789 or GB-987654321"
          helperText="Included on commercial invoices for legal tax compliance"
        />

        <InputField
          label="Dedicated Billing Email"
          name="billingEmail"
          type="email"
          value={formData.billingEmail}
          onChange={onChange}
          placeholder="accounts-payable@company.com"
          error={errors.billingEmail}
          helperText="Leave empty to use the primary contact email"
        />
      </div>

      <div className="section-divider" />

      <h4 className="subsection-title">Registered Billing Address</h4>
      <p className="subsection-subtitle">Appears on official invoices and receipts.</p>

      <div className="form-grid form-grid-2">
        <div className="grid-full-width">
          <InputField
            label="Street Address"
            name="street"
            value={formData.billingAddress?.street || ''}
            onChange={(e) => onNestedChange('billingAddress', 'street', e.target.value)}
            placeholder="123 Business Parkway, Suite 400"
          />
        </div>

        <InputField
          label="City"
          name="city"
          value={formData.billingAddress?.city || ''}
          onChange={(e) => onNestedChange('billingAddress', 'city', e.target.value)}
          placeholder="San Francisco"
        />

        <InputField
          label="State / Province / Region"
          name="state"
          value={formData.billingAddress?.state || ''}
          onChange={(e) => onNestedChange('billingAddress', 'state', e.target.value)}
          placeholder="California"
        />

        <InputField
          label="Postal / ZIP Code"
          name="postalCode"
          value={formData.billingAddress?.postalCode || ''}
          onChange={(e) => onNestedChange('billingAddress', 'postalCode', e.target.value)}
          placeholder="94105"
        />

        <InputField
          label="Country"
          name="country"
          value={formData.billingAddress?.country || ''}
          onChange={(e) => onNestedChange('billingAddress', 'country', e.target.value)}
          placeholder="United States"
        />
      </div>

      <div className="section-divider" />

      <h4 className="subsection-title">Invoice Automation & Late Policies</h4>

      <div className="toggles-list">
        <ToggleSwitch
          id="autoInvoice"
          name="autoInvoice"
          label="Automatic Invoice Generation"
          description="Automatically draft and queue invoices when project milestones are approved by the client."
          checked={formData.autoInvoice}
          onChange={(e) => onToggleChange('autoInvoice', e.target.checked)}
        />

        <ToggleSwitch
          id="applyLateFees"
          name="applyLateFees"
          label="Apply Overdue Interest & Late Fees"
          description="Automatically calculate interest on unpaid invoices after the grace period expires."
          checked={formData.applyLateFees}
          onChange={(e) => onToggleChange('applyLateFees', e.target.checked)}
        />

        {formData.applyLateFees && (
          <div className="conditional-fields-card form-grid form-grid-2">
            <InputField
              label="Late Fee Percentage"
              name="lateFeePercent"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.lateFeePercent}
              onChange={onChange}
              suffix="%"
              error={errors.lateFeePercent}
              helperText="Monthly late fee interest applied to overdue balance"
            />

            <InputField
              label="Grace Period"
              name="gracePeriodDays"
              type="number"
              min="0"
              step="1"
              value={formData.gracePeriodDays}
              onChange={onChange}
              suffix="days"
              error={errors.gracePeriodDays}
              helperText="Days after due date before late fees start accruing"
            />
          </div>
        )}
      </div>
    </div>
  );
};
