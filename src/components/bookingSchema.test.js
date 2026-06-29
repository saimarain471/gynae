import { describe, it, expect } from 'vitest'
import { bookingSchema } from './bookingSchema'

describe('Booking validation schema', () => {
  const validData = {
    fullName: 'Sarah Khan',
    email: 'sarah@example.com',
    phone: '03001234567',
    whatsappNumber: '03001234567',
    city: 'Lahore',
    paymentMethod: 'jazzcash',
    transactionId: 'TXN123456',
    additionalNotes: '',
  }

  it('accepts valid booking data', () => {
    const result = bookingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts data without additionalNotes', () => {
    // eslint-disable-next-line no-unused-vars
    const { additionalNotes: _unused, ...dataWithoutNotes } = validData
    const result = bookingSchema.safeParse(dataWithoutNotes)
    expect(result.success).toBe(true)
  })

  it('rejects fullName shorter than 3 characters', () => {
    const result = bookingSchema.safeParse({ ...validData, fullName: 'AB' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter your full name.')
  })

  it('rejects invalid email format', () => {
    const result = bookingSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter a valid email address.')
  })

  it('rejects phone shorter than 10 characters', () => {
    const result = bookingSchema.safeParse({ ...validData, phone: '12345' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter your phone number.')
  })

  it('rejects whatsappNumber shorter than 10 characters', () => {
    const result = bookingSchema.safeParse({ ...validData, whatsappNumber: '12345' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter your WhatsApp number.')
  })

  it('rejects city shorter than 2 characters', () => {
    const result = bookingSchema.safeParse({ ...validData, city: 'A' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter your city.')
  })

  it('rejects empty paymentMethod', () => {
    const result = bookingSchema.safeParse({ ...validData, paymentMethod: '' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please select a payment method.')
  })

  it('rejects transactionId shorter than 3 characters', () => {
    const result = bookingSchema.safeParse({ ...validData, transactionId: 'TX' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Please enter your transaction ID.')
  })

  it('rejects completely empty data', () => {
    const result = bookingSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error.issues.length).toBeGreaterThan(0)
  })

  it('accepts valid email formats', () => {
    const emails = ['user@example.com', 'a.b@domain.co.uk', 'test+tag@mail.org']
    emails.forEach((email) => {
      const result = bookingSchema.safeParse({ ...validData, email })
      expect(result.success).toBe(true)
    })
  })

  it('accepts long phone numbers', () => {
    const result = bookingSchema.safeParse({ ...validData, phone: '+923001234567' })
    expect(result.success).toBe(true)
  })
})
