import { useState, useEffect } from 'react'
import {
  CLIENT_STATUSES,
  CLIENT_PRIORITIES,
  INDUSTRIES,
  PRESET_LOGOS,
  STORAGE_KEY,
  INITIAL_FORM_STATE,
} from './constants'
import { validateClientForm, isValidImageUrl } from './validation'
import './ClientForm.css'

export default function ClientForm() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...INITIAL_FORM_STATE, ...parsed }
      }
    } catch {
      // Fallback to initial state if parsing fails
    }
    return INITIAL_FORM_STATE
  })

  const [errors, setErrors] = useState({})
  const [imageLoadError, setImageLoadError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const isFormEmpty = (data) => {
    return (
      !data.legalCompanyName &&
      !data.brandName &&
      !data.primaryContactName &&
      !data.email &&
      !data.phoneNumber &&
      !data.websiteUrl &&
      !data.industry &&
      !data.customIndustry &&
      !data.status &&
      !data.priority &&
      data.logoType === 'none' &&
      !data.logoPreset &&
      !data.logoUrl
    )
  }

  // Persist to localStorage whenever formData changes; remove if empty
  useEffect(() => {
    try {
      if (isFormEmpty(formData)) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      }
    } catch (e) {
      console.error('Failed to update localStorage', e)
    }
  }, [formData])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (successMessage) {
      setSuccessMessage('')
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (field === 'logoUrl') {
      setImageLoadError(false)
    }
  }

  const handleBlur = (field) => {
    const { errors: currentValidationErrors } = validateClientForm(formData)
    if (currentValidationErrors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: currentValidationErrors[field],
      }))
    }
  }

  const handleLogoTypeChange = (type) => {
    setImageLoadError(false)
    setFormData((prev) => ({
      ...prev,
      logoType: type,
      // If switching to preset and none selected, default to first preset
      logoPreset: type === 'preset' && !prev.logoPreset ? PRESET_LOGOS[0].id : prev.logoPreset,
    }))
  }

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to remove from localStorage', e)
    }
    setFormData(INITIAL_FORM_STATE)
    setErrors({})
    setImageLoadError(false)
    setSuccessMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateClientForm(formData)

    if (!isValid || (formData.logoType === 'url' && formData.logoUrl && imageLoadError)) {
      const finalErrors = { ...validationErrors }
      if (formData.logoType === 'url' && formData.logoUrl && imageLoadError) {
        finalErrors.logoUrl = 'Image failed to load. Please provide a valid, accessible image URL.'
      }
      setErrors(finalErrors)
      setSuccessMessage('')
      return
    }

    setErrors({})
    setSuccessMessage('Client information saved successfully.')
  }

  const selectedPreset = PRESET_LOGOS.find((p) => p.id === formData.logoPreset)

  return (
    <div className="client-form-container">
      <header className="client-form-header">
        <h1>Client Information</h1>
        <p className="form-description">
          Provide identity and contact details for the client. Fields marked with{' '}
          <span className="required-symbol" aria-hidden="true">*</span>
          <span className="sr-only">an asterisk</span> are required.
        </p>
      </header>

      {successMessage && (
        <div className="alert-message success" role="status" aria-live="polite">
          <span className="alert-icon" aria-hidden="true">✓</span>
          <span className="alert-text">{successMessage}</span>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="alert-message error" role="alert" aria-live="assertive">
          <span className="alert-icon" aria-hidden="true">⚠️</span>
          <span className="alert-text">
            Please fix the highlighted errors before submitting the form.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="client-form">
        {/* Company Identification Section */}
        <fieldset className="form-section">
          <legend className="section-title">Company Identification</legend>

          <div className="form-grid">
            {/* Legal Company Name */}
            <div className={`form-group ${errors.legalCompanyName ? 'has-error' : ''}`}>
              <label htmlFor="legalCompanyName" className="form-label">
                Legal Company Name <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="legalCompanyName"
                name="legalCompanyName"
                type="text"
                className="form-input"
                value={formData.legalCompanyName}
                onChange={(e) => handleFieldChange('legalCompanyName', e.target.value)}
                onBlur={() => handleBlur('legalCompanyName')}
                aria-required="true"
                aria-invalid={errors.legalCompanyName ? 'true' : 'false'}
                aria-describedby={errors.legalCompanyName ? 'legalCompanyName-error' : undefined}
                placeholder="e.g., Acme Corporation LLC"
              />
              {errors.legalCompanyName && (
                <div id="legalCompanyName-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.legalCompanyName}</span>
                </div>
              )}
            </div>

            {/* Brand / Display Name */}
            <div className={`form-group ${errors.brandName ? 'has-error' : ''}`}>
              <label htmlFor="brandName" className="form-label">
                Brand / Display Name <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                className="form-input"
                value={formData.brandName}
                onChange={(e) => handleFieldChange('brandName', e.target.value)}
                onBlur={() => handleBlur('brandName')}
                aria-required="true"
                aria-invalid={errors.brandName ? 'true' : 'false'}
                aria-describedby={errors.brandName ? 'brandName-error' : undefined}
                placeholder="e.g., Acme"
              />
              {errors.brandName && (
                <div id="brandName-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.brandName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-grid">
            {/* Industry */}
            <div className={`form-group ${errors.industry ? 'has-error' : ''}`}>
              <label htmlFor="industry" className="form-label">
                Industry <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="industry"
                name="industry"
                className="form-select"
                value={formData.industry}
                onChange={(e) => handleFieldChange('industry', e.target.value)}
                onBlur={() => handleBlur('industry')}
                aria-required="true"
                aria-invalid={errors.industry ? 'true' : 'false'}
                aria-describedby={errors.industry ? 'industry-error' : undefined}
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <div id="industry-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.industry}</span>
                </div>
              )}
            </div>

            {/* Custom Industry Input (shown when 'Other' selected) */}
            {formData.industry === 'Other' && (
              <div className={`form-group ${errors.customIndustry ? 'has-error' : ''}`}>
                <label htmlFor="customIndustry" className="form-label">
                  Specify Industry <span className="required-indicator" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id="customIndustry"
                  name="customIndustry"
                  type="text"
                  className="form-input"
                  value={formData.customIndustry}
                  onChange={(e) => handleFieldChange('customIndustry', e.target.value)}
                  onBlur={() => handleBlur('customIndustry')}
                  aria-required="true"
                  aria-invalid={errors.customIndustry ? 'true' : 'false'}
                  aria-describedby={errors.customIndustry ? 'customIndustry-error' : undefined}
                  placeholder="e.g., Renewable Energy"
                />
                {errors.customIndustry && (
                  <div id="customIndustry-error" className="field-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{errors.customIndustry}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </fieldset>

        {/* Contact Information Section */}
        <fieldset className="form-section">
          <legend className="section-title">Primary Contact & Web</legend>

          <div className="form-grid">
            {/* Primary Contact Name */}
            <div className={`form-group ${errors.primaryContactName ? 'has-error' : ''}`}>
              <label htmlFor="primaryContactName" className="form-label">
                Primary Contact Name <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="primaryContactName"
                name="primaryContactName"
                type="text"
                className="form-input"
                value={formData.primaryContactName}
                onChange={(e) => handleFieldChange('primaryContactName', e.target.value)}
                onBlur={() => handleBlur('primaryContactName')}
                aria-required="true"
                aria-invalid={errors.primaryContactName ? 'true' : 'false'}
                aria-describedby={
                  errors.primaryContactName ? 'primaryContactName-error' : undefined
                }
                placeholder="e.g., Jane Doe"
              />
              {errors.primaryContactName && (
                <div id="primaryContactName-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.primaryContactName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email" className="form-label">
                Email Address <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="e.g., jane@acme.com"
              />
              {errors.email && (
                <div id="email-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-grid">
            {/* Phone Number (Optional) */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number <span className="optional-indicator">(optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="form-input"
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                placeholder="e.g., +1 (555) 234-5678"
              />
            </div>

            {/* Website URL (Optional) */}
            <div className={`form-group ${errors.websiteUrl ? 'has-error' : ''}`}>
              <label htmlFor="websiteUrl" className="form-label">
                Website URL <span className="optional-indicator">(optional)</span>
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                className="form-input"
                value={formData.websiteUrl}
                onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
                onBlur={() => handleBlur('websiteUrl')}
                aria-invalid={errors.websiteUrl ? 'true' : 'false'}
                aria-describedby={errors.websiteUrl ? 'websiteUrl-error' : undefined}
                placeholder="https://example.com"
              />
              {errors.websiteUrl && (
                <div id="websiteUrl-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.websiteUrl}</span>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Client Classification Section */}
        <fieldset className="form-section">
          <legend className="section-title">Client Classification</legend>

          <div className="form-grid">
            {/* Client Status */}
            <div className={`form-group ${errors.status ? 'has-error' : ''}`}>
              <label htmlFor="status" className="form-label">
                Client Status <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                onBlur={() => handleBlur('status')}
                aria-required="true"
                aria-invalid={errors.status ? 'true' : 'false'}
                aria-describedby={errors.status ? 'status-error' : undefined}
              >
                <option value="">Select status</option>
                {CLIENT_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <div id="status-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.status}</span>
                </div>
              )}
            </div>

            {/* Client Priority */}
            <div className={`form-group ${errors.priority ? 'has-error' : ''}`}>
              <label htmlFor="priority" className="form-label">
                Client Priority <span className="required-indicator" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                onBlur={() => handleBlur('priority')}
                aria-required="true"
                aria-invalid={errors.priority ? 'true' : 'false'}
                aria-describedby={errors.priority ? 'priority-error' : undefined}
              >
                <option value="">Select priority</option>
                {CLIENT_PRIORITIES.map((pr) => (
                  <option key={pr.value} value={pr.value}>
                    {pr.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <div id="priority-error" className="field-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{errors.priority}</span>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Client Logo Section */}
        <fieldset className="form-section">
          <legend className="section-title">
            Client Logo <span className="optional-indicator">(optional)</span>
          </legend>

          <div className="logo-mode-selector">
            <span className="logo-mode-label">Logo source:</span>
            <div className="radio-group" role="radiogroup" aria-label="Logo source options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="logoType"
                  value="none"
                  checked={formData.logoType === 'none'}
                  onChange={() => handleLogoTypeChange('none')}
                />
                <span>No Logo</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="logoType"
                  value="preset"
                  checked={formData.logoType === 'preset'}
                  onChange={() => handleLogoTypeChange('preset')}
                />
                <span>Preset Icon</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="logoType"
                  value="url"
                  checked={formData.logoType === 'url'}
                  onChange={() => handleLogoTypeChange('url')}
                />
                <span>Image URL</span>
              </label>
            </div>
          </div>

          {/* Preset Logo Selection */}
          {formData.logoType === 'preset' && (
            <div className="preset-grid" role="radiogroup" aria-label="Preset logos">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = formData.logoPreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`preset-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleFieldChange('logoPreset', preset.id)}
                  >
                    <img src={preset.url} alt={preset.name} className="preset-image" />
                    <span className="preset-name">{preset.name}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Custom Image URL Input & Preview */}
          {formData.logoType === 'url' && (
            <div className="logo-url-container">
              <div className={`form-group ${errors.logoUrl || imageLoadError ? 'has-error' : ''}`}>
                <label htmlFor="logoUrl" className="form-label">
                  Image URL
                </label>
                <input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  className="form-input"
                  value={formData.logoUrl}
                  onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
                  onBlur={() => handleBlur('logoUrl')}
                  aria-invalid={errors.logoUrl || imageLoadError ? 'true' : 'false'}
                  aria-describedby={
                    errors.logoUrl || imageLoadError ? 'logoUrl-error' : undefined
                  }
                  placeholder="https://example.com/logo.png"
                />
                {(errors.logoUrl || imageLoadError) && (
                  <div id="logoUrl-error" className="field-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>
                      {errors.logoUrl ||
                        'Failed to load image from the provided URL. Please check the URL and ensure the image is accessible.'}
                    </span>
                  </div>
                )}
              </div>

              {/* URL Preview */}
              {formData.logoUrl && isValidImageUrl(formData.logoUrl) && (
                <div className="logo-preview-box">
                  <span className="preview-label">Live Preview:</span>
                  <div className="preview-image-wrapper">
                    <img
                      src={formData.logoUrl}
                      alt="Client logo preview"
                      className="preview-image"
                      onLoad={() => setImageLoadError(false)}
                      onError={() => setImageLoadError(true)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Preset Preview */}
          {formData.logoType === 'preset' && selectedPreset && (
            <div className="logo-preview-box">
              <span className="preview-label">Selected Logo:</span>
              <div className="preview-image-wrapper">
                <img
                  src={selectedPreset.url}
                  alt={`${selectedPreset.name} preview`}
                  className="preview-image"
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Client Information
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  )
}
