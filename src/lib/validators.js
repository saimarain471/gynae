import { z } from 'zod'

/**
 * Step 1: Personal details schema — shared between Booking and BookClass pages.
 */
export const personalDetailsSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.'),
  city: z.string().min(2, 'Please enter your city.'),
})

/**
 * Step 2: Payment details schema for class bookings.
 */
export const classPaymentSchema = z.object({
  paymentMethod: z.enum(['JazzCash', 'EasyPaisa', 'Bank Transfer'], { message: 'Please select a payment method.' }),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})

/**
 * Step 2: Payment + scheduling schema for consultation bookings.
 */
export const consultationPaymentSchema = z.object({
  preferredDate: z.string().min(1, 'Please select a preferred date.'),
  preferredTimeSlot: z.string().min(1, 'Please select a time slot.'),
  concern: z.string().min(20, 'Please describe your concern in at least 20 characters.'),
  paymentMethod: z.string().min(1, 'Please select a payment method.'),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})

/**
 * Validate form values against a schema and apply errors to a react-hook-form setError.
 * Returns true if valid, false otherwise.
 */
export function validateStep(schema, values, setError) {
  const result = schema.safeParse(values)
  if (result.success) return true

  const fieldErrors = result.error.flatten().fieldErrors
  Object.entries(fieldErrors).forEach(([field, messages]) => {
    setError(field, { type: 'validation', message: messages?.[0] ?? 'Invalid value' })
  })
  return false
}
