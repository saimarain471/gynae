import { z } from 'zod'

export const bookingSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.'),
  city: z.string().min(2, 'Please enter your city.'),
  paymentMethod: z.string().nonempty('Please select a payment method.'),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})
