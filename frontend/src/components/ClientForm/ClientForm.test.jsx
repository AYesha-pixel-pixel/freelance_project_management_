import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ClientForm from './ClientForm'
import { STORAGE_KEY } from './constants'

describe('ClientForm Component', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // 1. Required-field validation
  it('displays validation errors for all required fields when submitting an empty form', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const submitBtn = screen.getByRole('button', { name: /save client information/i })
    await user.click(submitBtn)

    expect(
      screen.getByText(/please fix the highlighted errors before submitting the form/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/legal company name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/brand \/ display name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/primary contact name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/industry selection is required/i)).toBeInTheDocument()
    expect(screen.getByText(/client status is required/i)).toBeInTheDocument()
    expect(screen.getByText(/client priority is required/i)).toBeInTheDocument()
  })

  it('validates custom industry when "Other" is selected', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const industrySelect = screen.getByLabelText(/industry/i)
    await user.selectOptions(industrySelect, 'Other')

    const customIndustryInput = screen.getByLabelText(/specify industry/i)
    expect(customIndustryInput).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /save client information/i })
    await user.click(submitBtn)

    expect(screen.getByText(/please specify the custom industry/i)).toBeInTheDocument()
  })

  // 2. Invalid email validation
  it('displays an error when an invalid email address is entered', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email-format')

    const submitBtn = screen.getByRole('button', { name: /save client information/i })
    await user.click(submitBtn)

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  // 3. Invalid website URL validation
  it('displays an error when an invalid website URL is entered', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const websiteInput = screen.getByLabelText(/website url/i)
    await user.type(websiteInput, 'not-a-valid-url')

    const submitBtn = screen.getByRole('button', { name: /save client information/i })
    await user.click(submitBtn)

    expect(screen.getByText(/please enter a valid website url/i)).toBeInTheDocument()
  })

  // 4. Valid form submission
  it('successfully submits valid client data and displays success feedback', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    await user.type(screen.getByLabelText(/legal company name/i), 'Starlight Innovations Inc.')
    await user.type(screen.getByLabelText(/brand \/ display name/i), 'Starlight')
    await user.type(screen.getByLabelText(/primary contact name/i), 'Alice Morgan')
    await user.type(screen.getByLabelText(/email address/i), 'alice@starlight.io')
    await user.type(screen.getByLabelText(/phone number/i), '+1 555 987 6543')
    await user.type(screen.getByLabelText(/website url/i), 'https://starlight.io')
    await user.selectOptions(screen.getByLabelText(/industry/i), 'Technology & Software')
    await user.selectOptions(screen.getByLabelText(/client status/i), 'Active')
    await user.selectOptions(screen.getByLabelText(/client priority/i), 'VIP')

    const submitBtn = screen.getByRole('button', { name: /save client information/i })
    await user.click(submitBtn)

    expect(screen.getByRole('status')).toHaveTextContent(/client information saved successfully/i)
    expect(screen.queryByText(/please fix the highlighted errors/i)).not.toBeInTheDocument()
  })

  // 5. Client logo URL validation and preview behavior
  it('handles preset logo selection and preview', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const presetRadio = screen.getByLabelText(/preset icon/i)
    await user.click(presetRadio)

    const presetButtons = screen.getAllByRole('radio', { name: /prism|nexus|wave|spark/i })
    expect(presetButtons.length).toBeGreaterThan(0)

    // Click second preset
    await user.click(presetButtons[1])
    expect(screen.getByAltText(/emerald nexus preview/i)).toBeInTheDocument()
  })

  it('handles image URL entry, live preview, and load errors', async () => {
    const user = userEvent.setup()
    render(<ClientForm />)

    const urlRadio = screen.getByRole('radio', { name: /image url/i })
    await user.click(urlRadio)

    const logoUrlInput = screen.getByPlaceholderText('https://example.com/logo.png')
    await user.type(logoUrlInput, 'https://example.com/logo.png')

    const previewImg = screen.getByAltText('Client logo preview')
    expect(previewImg).toBeInTheDocument()
    expect(previewImg).toHaveAttribute('src', 'https://example.com/logo.png')

    // Simulate image loading failure
    fireEvent.error(previewImg)

    expect(
      screen.getByText(/failed to load image from the provided url/i)
    ).toBeInTheDocument()
  })

  // 6. localStorage persistence
  it('persists form state changes to localStorage and restores them on mount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ClientForm />)

    const companyInput = screen.getByLabelText(/legal company name/i)
    await user.type(companyInput, 'Apex Dynamics Corp')

    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    expect(savedData.legalCompanyName).toBe('Apex Dynamics Corp')

    unmount()

    // Re-mount component
    render(<ClientForm />)
    expect(screen.getByLabelText(/legal company name/i)).toHaveValue('Apex Dynamics Corp')
  })

  // 7. Reset behavior and clearing localStorage
  it('clears form state, error messages, and removes item from localStorage on Reset', async () => {
    const user = userEvent.setup()
    const initialData = {
      legalCompanyName: 'Test Corp',
      brandName: 'Test',
      primaryContactName: 'John',
      email: 'john@test.com',
      phoneNumber: '',
      websiteUrl: '',
      industry: 'Technology & Software',
      customIndustry: '',
      status: 'Lead',
      priority: 'Standard',
      logoType: 'none',
      logoPreset: '',
      logoUrl: '',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))

    const { unmount } = render(<ClientForm />)

    expect(screen.getByLabelText(/legal company name/i)).toHaveValue('Test Corp')

    const resetBtn = screen.getByRole('button', { name: /reset form/i })
    await user.click(resetBtn)

    expect(screen.getByLabelText(/legal company name/i)).toHaveValue('')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    unmount()

    // Re-mounting should remain empty
    render(<ClientForm />)
    expect(screen.getByLabelText(/legal company name/i)).toHaveValue('')
  })
})
