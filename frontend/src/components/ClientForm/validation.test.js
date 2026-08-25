import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidHttpUrl,
  isValidImageUrl,
  validateClientForm,
} from './validation'

describe('ClientForm Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@sub.domain.co.uk')).toBe(true)
      expect(isValidEmail('admin_123@company.org')).toBe(true)
    })

    it('returns false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('plainaddress')).toBe(false)
      expect(isValidEmail('@missingusername.com')).toBe(false)
      expect(isValidEmail('username@.com')).toBe(false)
      expect(isValidEmail('username@domain')).toBe(false)
      expect(isValidEmail('username@domain..com')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
    })
  })

  describe('isValidHttpUrl', () => {
    it('returns true for valid HTTP and HTTPS URLs', () => {
      expect(isValidHttpUrl('http://example.com')).toBe(true)
      expect(isValidHttpUrl('https://example.com')).toBe(true)
      expect(isValidHttpUrl('https://sub.domain.org/path?query=1#hash')).toBe(true)
    })

    it('returns false for invalid or unsupported protocol URLs', () => {
      expect(isValidHttpUrl('ftp://example.com')).toBe(false)
      expect(isValidHttpUrl('not-a-url')).toBe(false)
      expect(isValidHttpUrl('example.com')).toBe(false)
      expect(isValidHttpUrl('http://')).toBe(false)
      expect(isValidHttpUrl('')).toBe(false)
    })
  })

  describe('isValidImageUrl', () => {
    it('returns true for valid HTTP/HTTPS image URLs and data URLs', () => {
      expect(isValidImageUrl('https://example.com/logo.png')).toBe(true)
      expect(isValidImageUrl('http://example.com/images/avatar.jpg')).toBe(true)
      expect(isValidImageUrl('data:image/svg+xml;utf8,<svg></svg>')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isValidImageUrl('invalid-url')).toBe(false)
      expect(isValidImageUrl('')).toBe(false)
      expect(isValidImageUrl(null)).toBe(false)
    })
  })

  describe('validateClientForm', () => {
    const validFormData = {
      legalCompanyName: 'Acme Global LLC',
      brandName: 'Acme',
      primaryContactName: 'John Doe',
      email: 'john@acme.com',
      phoneNumber: '+1-555-0199',
      websiteUrl: 'https://acme.com',
      industry: 'Technology & Software',
      customIndustry: '',
      status: 'Active',
      priority: 'VIP',
      logoType: 'none',
      logoPreset: '',
      logoUrl: '',
    }

    it('validates a complete, valid form data object', () => {
      const result = validateClientForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('flags all required fields when empty', () => {
      const emptyForm = {
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
        logoType: 'none',
        logoPreset: '',
        logoUrl: '',
      }

      const result = validateClientForm(emptyForm)
      expect(result.isValid).toBe(false)
      expect(result.errors.legalCompanyName).toBeDefined()
      expect(result.errors.brandName).toBeDefined()
      expect(result.errors.primaryContactName).toBeDefined()
      expect(result.errors.email).toBeDefined()
      expect(result.errors.industry).toBeDefined()
      expect(result.errors.status).toBeDefined()
      expect(result.errors.priority).toBeDefined()
    })

    it('flags invalid email format', () => {
      const result = validateClientForm({
        ...validFormData,
        email: 'invalid-email',
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toContain('valid email address')
    })

    it('flags invalid website URL when provided', () => {
      const result = validateClientForm({
        ...validFormData,
        websiteUrl: 'not_a_valid_url',
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.websiteUrl).toContain('valid website URL')
    })

    it('allows empty optional website URL', () => {
      const result = validateClientForm({
        ...validFormData,
        websiteUrl: '',
      })
      expect(result.isValid).toBe(true)
      expect(result.errors.websiteUrl).toBeUndefined()
    })

    it('requires customIndustry when industry is Other', () => {
      const result = validateClientForm({
        ...validFormData,
        industry: 'Other',
        customIndustry: '',
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.customIndustry).toContain('specify the custom industry')

      const validOther = validateClientForm({
        ...validFormData,
        industry: 'Other',
        customIndustry: 'Space Exploration',
      })
      expect(validOther.isValid).toBe(true)
    })
  })
})
