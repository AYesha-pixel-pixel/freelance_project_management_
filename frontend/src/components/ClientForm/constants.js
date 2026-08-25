export const CLIENT_STATUSES = [
  { value: 'Lead', label: 'Lead' },
  { value: 'Active', label: 'Active' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Archived', label: 'Archived' },
]

export const CLIENT_PRIORITIES = [
  { value: 'Standard', label: 'Standard' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Retainer', label: 'Retainer' },
]

export const INDUSTRIES = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Financial Services',
  'E-Commerce & Retail',
  'Marketing & Advertising',
  'Education & E-Learning',
  'Real Estate & Construction',
  'Manufacturing & Logistics',
  'Media & Entertainment',
  'Professional Services',
  'Other',
]

export const PRESET_LOGOS = [
  {
    id: 'preset-hexagon',
    name: 'Hexagon Prism',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><polygon points="32,4 60,20 60,52 32,60 4,52 4,20" fill="%23aa3bff" stroke="%238420d9" stroke-width="3"/><circle cx="32" cy="32" r="14" fill="white" fill-opacity="0.9"/></svg>',
  },
  {
    id: 'preset-emerald',
    name: 'Emerald Nexus',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="%2310b981"/><path d="M20 32 L32 20 L44 32 L32 44 Z" fill="white"/></svg>',
  },
  {
    id: 'preset-ocean',
    name: 'Ocean Wave',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="56" height="56" x="4" y="4" rx="12" fill="%230284c7"/><path d="M12 36 Q 22 22, 32 36 T 52 36" stroke="white" stroke-width="5" stroke-linecap="round" fill="none"/></svg>',
  },
  {
    id: 'preset-amber',
    name: 'Amber Spark',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" fill="%23f59e0b"/><polygon points="32,14 38,26 50,28 41,37 43,50 32,44 21,50 23,37 14,28 26,26" fill="white"/></svg>',
  },
]

export const STORAGE_KEY = 'freelance_client_form_data'

export const INITIAL_FORM_STATE = {
  legalCompanyName: '',
  brandName: '',
  primaryContactName: '',
  email: '',
  phoneNumber: '',
  websiteUrl: '',
  industry: '',
  customIndustry: '',
  status: '',
  priority: '',
  logoType: 'none', // 'preset' | 'url' | 'none'
  logoPreset: '',
  logoUrl: '',
}
