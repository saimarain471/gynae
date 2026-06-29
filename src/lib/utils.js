import { WHATSAPP_NUMBER } from './constants'

/**
 * Format an ISO date string to a localized Pakistan date.
 * e.g. "25 June 2025"
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Build a WhatsApp API link with pre-filled message.
 * @param {string} message - The message text (not encoded)
 * @param {string} [phone] - Override the WhatsApp number
 */
export function buildWhatsappLink(message, phone = WHATSAPP_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Build a WhatsApp link for class booking confirmation.
 */
export function buildClassWhatsappLink({ fullName, paymentMethod, transactionId, classTitle }) {
  const message = `Assalam o Alaikum Dr. Zainub! I have enrolled in ${classTitle} and sent payment via ${paymentMethod}. My Transaction ID is ${transactionId}. My name is ${fullName}.`
  return buildWhatsappLink(message)
}

/**
 * Build a WhatsApp link for consultation booking confirmation.
 */
export function buildConsultationWhatsappLink({ fullName, paymentMethod, transactionId, preferredDate, preferredTimeSlot }) {
  const message = `Assalam o Alaikum Dr. Zainab! I have booked a consultation and sent payment via ${paymentMethod}. My Transaction ID is ${transactionId}. Preferred: ${preferredDate} (${preferredTimeSlot}). My name is ${fullName}.`
  return buildWhatsappLink(message)
}

/**
 * Copy text to clipboard with a callback for UI feedback.
 * Returns true on success.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
