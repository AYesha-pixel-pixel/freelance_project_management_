export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim()
  if (trimmed.length > 254 || trimmed.includes('..')) return false
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(trimmed)
}

export function isValidHttpUrl(string) {
  if (!string || typeof string !== 'string') return false
  const trimmed = string.trim()
  try {
    const parsed = new URL(trimmed)
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.length > 0 &&
      parsed.hostname.includes('.')
    )
  } catch {
    return false
  }
}

export function isValidImageUrl(string) {
  if (!string || typeof string !== 'string') return false
  const trimmed = string.trim()
  if (trimmed.startsWith('data:image/')) return true
  try {
    const parsed = new URL(trimmed)
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.length > 0
    )
  } catch {
    return false
  }
}

export function validateClientForm(formData) {
  const errors = {}

  if (!formData.legalCompanyName || !formData.legalCompanyName.trim()) {
    errors.legalCompanyName = 'Legal Company Name is required.'
  }

  if (!formData.brandName || !formData.brandName.trim()) {
    errors.brandName = 'Brand / Display Name is required.'
  }

  if (!formData.primaryContactName || !formData.primaryContactName.trim()) {
    errors.primaryContactName = 'Primary Contact Name is required.'
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address (e.g., name@company.com).'
  }

  if (formData.websiteUrl && formData.websiteUrl.trim()) {
    if (!isValidHttpUrl(formData.websiteUrl)) {
      errors.websiteUrl = 'Please enter a valid website URL starting with http:// or https:// (e.g., https://example.com).'
    }
  }

  if (!formData.industry || !formData.industry.trim()) {
    errors.industry = 'Industry selection is required.'
  } else if (formData.industry === 'Other') {
    if (!formData.customIndustry || !formData.customIndustry.trim()) {
      errors.customIndustry = 'Please specify the custom industry.'
    }
  }

  if (!formData.status || !formData.status.trim()) {
    errors.status = 'Client Status is required.'
  }

  if (!formData.priority || !formData.priority.trim()) {
    errors.priority = 'Client Priority is required.'
  }

  if (formData.logoType === 'url' && formData.logoUrl && formData.logoUrl.trim()) {
    if (!isValidImageUrl(formData.logoUrl)) {
      errors.logoUrl = 'Please enter a valid image URL starting with http:// or https://.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
