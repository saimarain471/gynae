import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingForm from './BookingForm'

vi.mock('../lib/posthog', () => ({
  posthog: { capture: vi.fn() },
}))

describe('BookingForm', () => {
  const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
    return render(
      <BookingForm submitLabel="Book Now" onSubmit={onSubmit}>
        {({ register, errors }) => (
          <>
            <input {...register('fullName')} placeholder="Full Name" />
            {errors.fullName && <span role="alert">{errors.fullName.message}</span>}
            <input {...register('email')} placeholder="Email" />
            {errors.email && <span role="alert">{errors.email.message}</span>}
            <input {...register('phone')} placeholder="Phone" />
            {errors.phone && <span role="alert">{errors.phone.message}</span>}
            <input {...register('whatsappNumber')} placeholder="WhatsApp" />
            <input {...register('city')} placeholder="City" />
            <select {...register('paymentMethod')}>
              <option value="">Select</option>
              <option value="jazzcash">JazzCash</option>
            </select>
            <input {...register('transactionId')} placeholder="Transaction ID" />
            <input {...register('additionalNotes')} placeholder="Notes" />
          </>
        )}
      </BookingForm>
    )
  }

  const fillValidForm = async (user) => {
    await user.type(screen.getByPlaceholderText('Full Name'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Phone'), '03001234567')
    await user.type(screen.getByPlaceholderText('WhatsApp'), '03001234567')
    await user.type(screen.getByPlaceholderText('City'), 'Lahore')
    await user.selectOptions(screen.getByRole('combobox'), 'jazzcash')
    await user.type(screen.getByPlaceholderText('Transaction ID'), 'TXN123')
  }

  it('renders the submit button with the provided label', () => {
    renderForm()
    expect(screen.getByRole('button', { name: 'Book Now' })).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    renderForm()
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Transaction ID')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Book Now' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '03001234567',
          whatsappNumber: '03001234567',
          city: 'Lahore',
          paymentMethod: 'jazzcash',
          transactionId: 'TXN123',
        })
      )
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Book Now' }))

    await waitFor(() => {
      expect(screen.getByText(/Your booking has been received/)).toBeInTheDocument()
    })
  })

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))
    renderForm(onSubmit)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Book Now' }))

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
    })
  })



  it('shows Submitting text while loading', async () => {
    const user = userEvent.setup()
    let resolveSubmit
    const onSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => { resolveSubmit = resolve }))
    renderForm(onSubmit)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Book Now' }))

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    await act(async () => { resolveSubmit() })
  })
})
