/**
 * Validation rules for the Client Settings Form
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export const validateClientSettings = (data) => {
  const errors = {};

  // General Information
  if (!data.companyName || !data.companyName.trim()) {
    errors.companyName = 'Company name is required';
  } else if (data.companyName.trim().length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  }

  if (!data.contactName || !data.contactName.trim()) {
    errors.contactName = 'Primary contact name is required';
  }

  if (!data.contactEmail || !data.contactEmail.trim()) {
    errors.contactEmail = 'Contact email is required';
  } else if (!EMAIL_REGEX.test(data.contactEmail.trim())) {
    errors.contactEmail = 'Please provide a valid email address';
  }

  if (data.website && data.website.trim() && !URL_REGEX.test(data.website.trim())) {
    errors.website = 'Please enter a valid website URL (e.g., https://example.com)';
  }

  // Billing
  if (data.billingEmail && data.billingEmail.trim() && !EMAIL_REGEX.test(data.billingEmail.trim())) {
    errors.billingEmail = 'Please provide a valid billing email address';
  }

  if (data.defaultHourlyRate === '' || data.defaultHourlyRate === null || Number(data.defaultHourlyRate) < 0) {
    errors.defaultHourlyRate = 'Hourly rate cannot be negative';
  }

  if (data.defaultProjectBudget === '' || data.defaultProjectBudget === null || Number(data.defaultProjectBudget) < 0) {
    errors.defaultProjectBudget = 'Project budget cannot be negative';
  }

  if (data.applyLateFees) {
    if (data.lateFeePercent === '' || Number(data.lateFeePercent) < 0 || Number(data.lateFeePercent) > 100) {
      errors.lateFeePercent = 'Late fee must be between 0% and 100%';
    }
    if (data.gracePeriodDays === '' || Number(data.gracePeriodDays) < 0) {
      errors.gracePeriodDays = 'Grace period cannot be negative';
    }
  }

  // Workflow
  if (data.includedRevisions === '' || Number(data.includedRevisions) < 0) {
    errors.includedRevisions = 'Included revisions cannot be negative';
  }

  if (data.extraRevisionRate === '' || Number(data.extraRevisionRate) < 0) {
    errors.extraRevisionRate = 'Extra revision rate cannot be negative';
  }

  if (data.deadlineBufferDays === '' || Number(data.deadlineBufferDays) < 0) {
    errors.deadlineBufferDays = 'Deadline buffer days cannot be negative';
  }

  if (data.assetHubUrl && data.assetHubUrl.trim() && !URL_REGEX.test(data.assetHubUrl.trim())) {
    errors.assetHubUrl = 'Please enter a valid resource URL';
  }

  if (data.contractAgreementUrl && data.contractAgreementUrl.trim() && !URL_REGEX.test(data.contractAgreementUrl.trim())) {
    errors.contractAgreementUrl = 'Please enter a valid contract agreement URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Returns the count of errors within specific tabs to highlight tab status
 */
export const getSectionErrorCounts = (errors) => {
  const generalKeys = ['companyName', 'contactName', 'contactEmail', 'website'];
  const billingKeys = ['billingEmail', 'defaultHourlyRate', 'defaultProjectBudget', 'lateFeePercent', 'gracePeriodDays'];
  const workflowKeys = ['includedRevisions', 'extraRevisionRate', 'deadlineBufferDays', 'assetHubUrl'];
  const contractsKeys = ['contractAgreementUrl'];

  return {
    general: generalKeys.filter((k) => errors[k]).length,
    billing: billingKeys.filter((k) => errors[k]).length,
    workflow: workflowKeys.filter((k) => errors[k]).length,
    portal: 0,
    contracts: contractsKeys.filter((k) => errors[k]).length,
  };
};
